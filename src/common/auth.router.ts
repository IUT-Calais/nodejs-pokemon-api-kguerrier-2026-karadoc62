import { Router } from 'express'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import prisma from '../client.js'

export const authRouter = Router()

// POST /auth/login
// Accessible via POST /auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {

        // 1. Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({ where: { email }, })

        if (!user) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' })
            return
        }

        // 2. Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' })
            return
        }

        // 3. Générer le JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }, // Le token expire dans 1 heure
        )

        // 4. Retourner le token
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        })
        return
    } catch (error) {
        console.error('Erreur lors de la connexion:', error)
        res.status(500).json({ error: 'Erreur serveur' })
        return
    }
})