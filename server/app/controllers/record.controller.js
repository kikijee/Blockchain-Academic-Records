const db = require("../models");
const User = db.users;
const Record = db.records;
const Institution = db.institutions;


exports.createRecord = async (req, res) => {
    try {
        const record = await Record.create(req.body);
        res.status(201).send(record);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findAllRecords = async (req, res) => {
    try {
        const records = await Record.findAll();
        res.send(records);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findRecordById = async (req, res) => {
    const id = req.body.id;
    try {
        const record = await Record.findByPk(id);
        if (record) {
            res.send(record);
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findRecordsByStudentID = async (req, res) => {
    const studentID = req.User.ID;

    if (!studentID) {
        return res.status(400).send({ message: "Student ID is missing" });
    }

    try {
        const records = await Record.findAll({ 
            where: { 
                UserID: studentID 
            }, 
            include: [
              {
                model: Institution, 
                attributes: ['SchoolName'],
                as: 'Institution'                
              },
              {
                model: User,
                attributes: ['FirstName', 'LastName', 'DateOfBirth'],
                as: 'Student'
              }
            ]
        });

        if (records.length > 0) {
            const results = records.map(record => {
                const data = record.get({ plain: true });
                data.SchoolName = record.Institution ? `${record.Institution.SchoolName}` : 'N/A'; 
                data.FirstName = record.Student ? record.Student.FirstName : 'N/A';
                data.LastName = record.Student ? record.Student.LastName : 'N/A';
                data.DateOfBirth = record.Student ? record.Student.DateOfBirth : 'N/A';
                return data;  
            });

           res.send(results);
        } else {
            // Send an empty array with a 200 status code
            res.status(200).send([]);
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findRecordsByInstitutionID = async (req, res) => {
    try {
        const userID = req.User.ID; 
        const institution = await Institution.findOne({ where: { UserID: userID } }); 
        if (!institution) {
            return res.status(404).send({ message: "Institution not found" });
        }

        const records = await Record.findAll({ 
            where: { 
                InstitutionID: institution.InstitutionID 
            },
            include: [{
                model: User, 
                attributes: ['FirstName', 'LastName', 'DateOfBirth'],
                as: 'Student'
            }]
        });

        if (records.length > 0) {
            // Map the pending records to include student name
            const results = records.map(record => {
                const data = record.get({ plain: true });
                data.StudentName = record.Student ? `${record.Student.FirstName} ${record.Student.LastName}` : 'N/A';
                data.DateOfBirth = record.Student ? `${record.Student.DateOfBirth}` : 'N/A';
                return data;
            });
            
            res.send(results);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateRecordIPFSHash = async (req, res) => {
    const id = req.body.id;
    const newIPFS_Hash = req.body.IPFS_Hash;
    try {
        const updated = await Record.update({ IPFS_Hash: newIPFS_Hash }, { where: { id: id } });
        if (updated[0] > 0) { // Sequelize's update method returns an array where the first element is the number of updated rows
            const updatedRecord = await Record.findByPk(id);
            res.send(updatedRecord);
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deleteRecord = async (req, res) => {
    const id = req.body.id;
    try {
        const deleted = await Record.destroy({ where: { id: id } });
        if (deleted) {
            res.send({ message: "Record deleted successfully" });
        } else {
            res.status(404).send({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
