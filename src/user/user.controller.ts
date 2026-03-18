import type {Request, Response} from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Vérification que les champs ne soient pas vide
    if(!email || email.trim() === ""){
        res.status(400).send({error: "Email et password obligatoires"});
        return
    }
    if(!password || password.trim() === ""){
        res.status(400).send({error: "Email et password obligatoires"});
        return
    }

    try{
        // Vérifictaion que l'email n'existe pas en base
        const alreadyExistUser = await prisma.user.findUnique({
            where : {email}
        });
        if(alreadyExistUser){
            res.status(400).send({error : "Utilisateur déjà existant"});
            return
        }
    
        // cryptage du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // crétaion de l'utilsiateur
        const user = await prisma.user.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        );
        res.status(201).send({
            id: user.id,
            email: user.email
        });
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}

export const loginApplication = async (req: Request, res: Response) => {
    const{email, password} = req.body;

    // Vérification de la présence des champs requis
    if(!email || email.trim() === ""){
        res.status(400).send({error: "Email requis"});
        return
    }
    if(!password || password.trim() === ""){
        res.status(400).send({error: "Mot de passe requis"});
        return
    }
    
    try{
        // récupération du user
        const user = await prisma.user.findUnique(
            {where : {email}}
        );

        // vérification de l'existence du user
        if(!user){
            res.status(401).send({error: "L'utilisateur ou le mot de passe est erroné"});
            return
        }

        // verifier le mot de passe avec bcrypt
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk){
            res.status(401).send({error: "L'utilisateur ou le mot de passe est erroné"});
            return
        }
        
        // integration token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRATION
            }
        );

        res.status(200).send({token});
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
}