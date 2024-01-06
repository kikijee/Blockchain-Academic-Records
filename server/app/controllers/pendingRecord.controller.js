const db = require("../models");
const PendingRecord = db.pendingRecords;
const Institution = db.institutions;
const User = db.users;

// TESTED
exports.createPendingRecord = async (req, res) => {
    try {
        // checks to make sure that the sender id matches the student id provided in body
        if(req.User.ID !== req.body.UserID){   
            return res.status(401).send({message:"ID mismatch"})
        }
        const pendingRecord = await PendingRecord.create(req.body);
        res.status(201).send(pendingRecord);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// TESTED
exports.findAllPendingRecords = async (req, res) => {
    try {
        const pendingRecords = await PendingRecord.findAll();
        res.send(pendingRecords);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// NOT TESTED YET
// may just use params instead of body since this is a GET
exports.findPendingRecordById = async (req, res) => {
    const id = req.body.id;
    try {
        const pendingRecord = await PendingRecord.findByPk(id);
        if (pendingRecord) {
            res.send(pendingRecord);
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// TESTED
exports.findPendingRecordsByStudentID = async (req, res) => {
    try {
        // We dont need a url parameter since user id is included through 'User' from the authenticate token middleware function
        
        const pendingRecords = await PendingRecord.findAll({ where: { UserID: req.User.ID } });
        let institutionName
        for(i in pendingRecords){   // adding school name to responses
            institutionName = await Institution.findByPk(pendingRecords[i].InstitutionID, {attributes:['SchoolName']})
            pendingRecords[i].dataValues.SchoolName = institutionName.SchoolName
        }
        res.send(pendingRecords)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// TESTED
exports.findPendingRecordsByInstitutionID = async (req, res) => {
    try {
        // Find the institution based on the UserID from the token
        const institution = await Institution.findOne({
            where: { UserID: req.User.ID },
            attributes: ['InstitutionID']
        });

        if (institution) {
            // Find all pending records for the institution
            const pendingRecords = await PendingRecord.findAll({
                where: { 
                    InstitutionID: institution.InstitutionID,
                    Status: "Pending School" // Filter by status
                },
                include: [{
                    model: User, // Append Students name
                    attributes: ['FirstName', 'LastName'], // Only needed fields
                    as: 'Student' // Alias added to sequelize model
                }]
            });

            // Map the pending records to include student name
            const results = pendingRecords.map(record => {
                const data = record.get({ plain: true });
                data.StudentName = record.Student ? `${record.Student.FirstName} ${record.Student.LastName}` : 'N/A';
                return data;
            });

            res.send(results);
        } else {
            res.status(404).send({ message: "No institution found for this user." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// controller specifically for student since the student is the only one to be able to change the 'Description'
// TESTED
exports.updatePendingRecordStudent = async (req, res) =>{
    const id = req.body.PendingRecordID;
    const newDescription = req.body.Description;
    const newRecordType = req.body.RecordType;
    const newStatus = req.body.Status;
    try {
        const [numberOfAffectedRows] = await PendingRecord.update({ 
            Description: newDescription,
            RecordType: newRecordType, 
            Status: newStatus 
        }, { 
            where: { PendingRecordID: id } 
        });
        if (numberOfAffectedRows === 1) {
            res.status(200).send({ message: "Record successfully updated" });
        } 
        else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


exports.updatePendingRecord = async (req, res) => {
    const id = req.body.PendingRecordID;
    const newNote = req.body.Note;
    const newStatus = 'Pending Student';

    try {
        const [numberOfAffectedRows] = await PendingRecord.update({ 
            Note: newNote, 
            Status: newStatus 
        }, { 
            where: { PendingRecordID: id } 
        });

        if (numberOfAffectedRows === 1) {
            res.status(200).send({ message: "Record successfully updated" });
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// TESTED
exports.deletePendingRecord = async (req, res) => {
    try {
        // parses id from url
        const id = parseInt(req.params.id);
        // finds pending record by its id and returns the FK UserID and InstitutionID
        const record = await PendingRecord.findByPk(id,{attributes:['UserID','InstitutionID']})
        // finds the UserID that is related to the Institution
        const institutionUserID = await db.institutions.findByPk(record.InstitutionID,{attributes:['UserID']})
        
        // only student and instution relating to pending record should be able to delete it
        if(record.UserID !== req.User.ID && institutionUserID.UserID !== req.User.ID){  
            return res.status(401).send({message:"ID mismatch"})
        }

        const deleted = await PendingRecord.destroy({ where: { PendingRecordID: id } });
        if (deleted) {
            res.send({ message: "Record deleted successfully" });
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
