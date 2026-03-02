import type {Request, Response} from 'express';
import prisma from '../client.js'

export const createUser = async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body;

    try{
        const user = await prisma.user.create(
            {
                data: {
                    email,
                    password
                }
            }
        );
        res.status(201).send(user);
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}

export const loginApplication = async (req: Request, res: Response) => {
    const{email, password} = req.body;
    try{
        const user = await prisma.user.findUnique(
            {where : {email}}
        );
        res.status(200).send()
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}