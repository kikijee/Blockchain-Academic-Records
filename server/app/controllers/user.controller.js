const db = require("../models");
const User = db.users;

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all users
exports.findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get a specific user by ID
exports.findUserById = async (req, res) => {
    const id = req.body.id;

    try {
        const user = await User.findByPk(id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update a user's details
exports.updateUser = async (req, res) => {
    const id = req.body.id;

    try {
        const updated = await User.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedUser = await User.findByPk(id);
            res.send(updatedUser);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const id = req.body.id;

    try {
        const deleted = await User.destroy({ where: { id: id } });
        if (deleted) {
            res.send({ message: "User deleted successfully" });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
