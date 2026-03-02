import { Router } from "express";
import {createUser} from './user.controller.js';
import {loginApplication} from './user.controller.js';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginApplication);