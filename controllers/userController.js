const { createUser, authenticateUser } = require('../services/userService');

const registerUser = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const token = await authenticateUser(req.body);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };