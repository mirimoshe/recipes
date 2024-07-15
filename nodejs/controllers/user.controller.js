import bcrypt from 'bcrypt';
import User from '../models/user.model.js'
import { generateToken } from '../models/user.model.js';
import encryptPassword from '../models/user.model.js'
import { log } from 'console';



export const signIn = async (req, res, next) => {
    const {password,email} = req.body;
    console.log("jjjjjjjjj");
    try {
        const user = await User.findOne({ email });
        console.log("aaa",user);
        if (!user) {
            //return next({ message: 'Auth Failed', status: 401 });
            return res.status(401).json({ message: 'Auth Failed' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("check",isPasswordValid,password,user.password);
        if (!isPasswordValid) {
            //return next({ message: 'password is not valid', status: 401 });
            return res.status(401).json({ message: 'Password is not valid' });
        }

        const token = generateToken(user);
        user.password = "****"; // Hiding the password before sending user object

        return res.send({ user, token });
    } catch (error) {
        console.log("auth failed ahah");
        return next(new Error(error.message));
    }
};

export const signUp = async (req, res, next) => {
    console.log(req.body);
    try {
        const { userName,password,email,address,role} = req.body;
        console.log(userName || email || password);
        if (userName=='' || email=='' ) {//|| password>10000000
            return next(new Error('required field must be filled'))
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new Error('email is not valid'));
        }
        //const hashedPassword = await User.encryptPassword(password);
        //const user = new User({ userName, email, password: hashedPassword,address,role});
        const user = new User({ userName, email, password,address,role});
        await user.save();
        const token = generateToken(user);
        console.log(token);
        user.password = "****"; 
        return res.status(201).json({ user, token });
    } catch (error) {
        return next({ message: error.message, status: 400 });
    }
}

export const getUserList = async (req, res, next) => {
    console.log("hi2",req.user.role);
    try {
        const requestingUser = req.user; // Assuming the user making the request is available in req.user
        console.log("hello",requestingUser);
        if (!requestingUser || requestingUser.role !== 'admin') {
            throw new Error('Permission denied. Only administrators can access the user list.');
        }

        // קבלת רשימת כל המשתמשים מהמסד נתונים
        const users = await User.find();
        console.log("all users",users);
        // מחזיר את רשימת המשתמשים למנהל
        return res.status(200).json(users);
    } catch (error) {
        // טיפול בשגיאה במקרה של אי הרשאה או תקלה אחרת
        return next(new Error(error.message));
    }
};

export const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    
    //if (!mongoose.Types.ObjectId.isValid(userId)) {
    //    next({ message: 'id is not valid' })
    //}
    //else {
        try {
            const user = await User.findById(userId, { __v: false });
            console.log("userid",user);
            if (!user) {
                //return res.status(404).json({ message: 'Category not found' });
                next({ message: 'user not found', status: 404 })
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            //res.status(500).json({ message: 'An error occurred while getting the category.' });
            next(error);
        }
   // }

};