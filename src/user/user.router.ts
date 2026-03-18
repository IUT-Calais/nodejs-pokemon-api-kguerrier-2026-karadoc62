import { Router } from "express";
import {createUser, loginApplication} from './user.controller';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginApplication);