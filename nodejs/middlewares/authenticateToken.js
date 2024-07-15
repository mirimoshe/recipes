import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user; // Attach the user payload to the request object
        next();
    });
};

export default authenticateToken;
