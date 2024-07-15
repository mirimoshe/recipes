import jwt from 'jsonwebtoken';

export const  auth = async (req, res, next) => {
    try {
        
        const { authorization } = req.headers; // extracting the token from the headers
        console.log("hi",authorization);
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new Error('Unauthorized: Missing or invalid token');
        }

        const token = authorization.split(' ')[1];
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // using default if no secret provided

        if (privateKey === 'JWT_SECRET') {
            throw new Error('JWT secret is not configured');
        }

        const data = await jwt.verify(token, privateKey); // verifying the token
        req.user = data; // attaching user data to the request
        next(); // move to the next middleware
    } catch (error) {
        next(error); // pass the error to the error handling middleware
    }
};