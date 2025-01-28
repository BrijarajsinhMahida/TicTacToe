const jwt = require('jsonwebtoken');

// Helper used to generate token
exports.generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// Helper used to verify token
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};