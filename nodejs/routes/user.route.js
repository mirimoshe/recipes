import express from 'express';
import {auth} from '../middlewares/auth.js';
import {signIn,signUp,getUserList,getUserById} from '../controllers/user.controller.js';

export const userRouter=express.Router();

userRouter.post('/sign-in',signIn);
userRouter.post('/sign-up',signUp);
userRouter.get('/',auth,getUserList);
userRouter.get('/:id',getUserById);
