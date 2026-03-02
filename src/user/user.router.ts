import { Router } from "express";
import {createUser, loginApplication} from './user.controller.js';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginApplication);