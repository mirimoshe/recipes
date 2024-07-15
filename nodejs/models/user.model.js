
import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;



export const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: [8, 'password length < 8'] },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    role: { type: String, default: 'user' }// enum: ['user', 'admin'],
})

export const userValidator={
    userName:Joi.string().required().max(20),
    password:Joi.string().required().min(8).max(12).pattern(/^[a-zA-Z0-9]+$/),
    email:Joi.string().required().email(),
    address:Joi.string(),
    role:Joi.string(),
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

export const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }
    const tokenData = {
        role: user.role,
        user_id: user._id
    };
    const tokenOptions = {
        expiresIn: '1h'
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, tokenOptions);
    console.log(token);
    return token;
};


/*export const encryptPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}*/


/*userSchema.statics.encryptPassword = async function(password) {
    console.log('password to hash:',password);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};*/


const User = mongoose.model('User', userSchema);
export default  User ;