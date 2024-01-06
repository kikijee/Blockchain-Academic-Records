const db = require("../models");
const User = db.users;
const PendingInstitution = db.pendingInstitutions;
const Institution = db.institutions;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
	    const user = await User.findOne({ where: { Email: req.body.Email } });
	    //console.log(user);
	    if (!user) return res.status(400).send({ Message: "User not found" });
	
	    if (!req.body.AuthenticationData || !user.AuthenticationData) {
		return res.status(400).send({ Message: "Password data missing" });
	    }
		
	    const validPassword = await bcrypt.compare(req.body.AuthenticationData, user.AuthenticationData);
	    //console.log("Password comparison result:", validPassword);
	    if (!validPassword) return res.status(400).send({ Message: "Invalid password" });
	
	    // Generate JWT token
	    const token = jwt.sign({ ID: user.UserID, Role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
	
	    // Set the JWT token as an HttpOnly cookie
	    res.cookie('token', token, { 
		httpOnly: true, 
		sameSite: 'Lax', 
		maxAge: 60 * 60 * 1000,  // 1 hour expiration
		secure: false,
		path: '/'
	    });
		
	    // Respond with user data
	    res.status(200).send({
		message: "Logged in successfully!",
		User: {
		    ID: user.UserID,
		    Email: user.Email,
		    FirstName: user.FirstName,
		    LastName: user.LastName,
		    Role: user.Role
		}
	    });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

exports.register = async (req, res) => {
    // Validate request body data
    if (!req.body.Email || !req.body.FirstName || !req.body.LastName || !req.body.DateOfBirth || !req.body.AuthenticationData) {
        return res.status(400).send({ message: "Required field can not be empty" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.AuthenticationData, 10);

    // Create a new user
    try {
        const user = await User.create({
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            DateOfBirth: req.body.DateOfBirth,
            AuthenticationData: hashedPassword,
            Role: 'Student', // Manually passed because Institution account creation is handled in a custom function
        });
        const userResponse = user.toJSON();
        delete userResponse.AuthenticationData; // Removed auth data in response when creating a user
        res.status(201).send({ message: "User registered successfully!", user: userResponse });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.createPendingInstitution = async (req, res) => {
    // Validate request body data
    if (!req.body.Email || !req.body.FirstName || !req.body.LastName || !req.body.DateOfBirth || !req.body.AuthenticationData || !req.body.SchoolName || !req.body.Address || !req.body.WalletAddress) {
        return res.status(400).send({ message: "Required field can not be empty" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.AuthenticationData, 10);

    // Create a new pending institution
    try {
        const pendingInstitution = await PendingInstitution.create({
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            DateOfBirth: req.body.DateOfBirth,
            AuthenticationData: hashedPassword,
            SchoolName: req.body.SchoolName,
            Address: req.body.Address,
            WalletAddress: req.body.WalletAddress
        });
        const pendingInstitutionResponse = pendingInstitution.toJSON();
        delete pendingInstitutionResponse.AuthenticationData; // Remove auth data in response when creating an entry
        res.status(201).send({ message: "Institution registration request sent successfully!", pendingInstitution: pendingInstitutionResponse });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.createInstitution = async (req, res) => {
    const transaction = await db.sequelize.transaction();
	// Transaction command will make sure that if any step fails we 
	// Do not push any of the changes to the DB

    try {
        // Retrieve the pendingInstitution by its ID

        const pendingInstitution = await PendingInstitution.findByPk(req.body.id);

        if (!pendingInstitution) {
            return res.status(404).send({ message: "No pending institution found with the given ID" });
        }

        // Create a user entry with the data from the pendingInstitution
        const user = await User.create({
            Email: pendingInstitution.Email,
            FirstName: pendingInstitution.FirstName,
            LastName: pendingInstitution.LastName,
            DateOfBirth: pendingInstitution.DateOfBirth,
            AuthenticationData: pendingInstitution.AuthenticationData,
            Role: 'Institution',
        }, { transaction });

        // Create an institution entry
        const institution = await Institution.create({
            SchoolName: pendingInstitution.SchoolName,
            Address: pendingInstitution.Address,
            WalletAddress: pendingInstitution.WalletAddress,
            UserID: user.UserID,
        }, { transaction });

        // Delete the pendingInstitution
        await pendingInstitution.destroy({ transaction });

        await transaction.commit();

	delete user.dataValues.AuthenticationData; // Removed auth data in response
		
        res.status(201).send({
            message: "Institution created successfully!",
            institution,
            user,
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).send({ message: error.message });
    }
};

exports.declineInstitution = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
        const pendingInstitution = await PendingInstitution.findByPk(req.body.id);

        if (!pendingInstitution) {
            return res.status(404).send({ message: "No pending institution found with the given ID" });
        }

        // Delete the pendingInstitution
        await pendingInstitution.destroy({ transaction });

        await transaction.commit();
        
        res.status(200).send({
            message: "Pending institution declined and removed successfully!"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).send({ message: error.message });
    }
};
