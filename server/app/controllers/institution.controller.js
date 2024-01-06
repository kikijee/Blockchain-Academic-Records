const db = require("../models");
const Institution = db.institutions;

exports.findAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.findAll();
        res.send(institutions);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// may just use params instead of body since this is a GET
exports.findInstitutionById = async (req, res) => {
    const id = req.body.id;
    try {
        const institution = await Institution.findByPk(id);
        if (institution) {
            res.send(institution);
        } else {
            res.status(404).send({ message: "Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateInstitution = async (req, res) => {
    const id = req.body.id;
    try {
        const updated = await Institution.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedInstitution = await Institution.findByPk(id);
            res.send(updatedInstitution);
        } else {
            res.status(404).send({ message: "Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deleteInstitution = async (req, res) => {
    const id = req.body.id;
    try {
        const deleted = await Institution.destroy({ where: { id: id } });
        if (deleted) {
            res.send({ message: "Institution deleted successfully" });
        } else {
            res.status(404).send({ message: "Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
