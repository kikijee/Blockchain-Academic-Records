const db = require("../models");
const PendingInstitution = db.pendingInstitutions;

exports.findAllPendingInstitutions = async (req, res) => {
    try {
        const pendingInstitutions = await PendingInstitution.findAll();
        res.status(200).send(pendingInstitutions);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// may just use params instead of body since this is a GET
exports.findPendingInstitutionById = async (req, res) => {
    const id = req.body.id;
    try {
        const pendingInstitution = await PendingInstitution.findByPk(id);
        if (pendingInstitution) {
            res.send(pendingInstitution);
        } else {
            res.status(404).send({ message: "Pending Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updatePendingInstitution = async (req, res) => {
    const id = req.body.id;
    try {
        const updated = await PendingInstitution.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedPendingInstitution = await PendingInstitution.findByPk(id);
            res.send(updatedPendingInstitution);
        } else {
            res.status(404).send({ message: "Pending Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deletePendingInstitution = async (req, res) => {
    const id = req.body.id;
    try {
        const deleted = await PendingInstitution.destroy({ where: { id: id } });
        if (deleted) {
            res.send({ message: "Pending Institution deleted successfully" });
        } else {
            res.status(404).send({ message: "Pending Institution not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
