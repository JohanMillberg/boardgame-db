import prisma from '../db';
import { Request, Response } from 'express';
import { comparePassword, createJWT, hashPassword } from '../modules/auth';
import { User } from '@prisma/client';

export const createNewUser = async (req: Request, res: Response) => {
    const user: User = await prisma.user.create({
        data: {
            username: req.body.username,
            password: await hashPassword(req.body.password)
        }
    })
    const token = createJWT(user);

    res.status(200);
    res.json({ token });
}

export const signIn = async (req: Request, res: Response) => {
    const user: User | null = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        }
    });

    if (user === null) {
        res.status(401);
        res.json({ message: 'User does not exist' });
        return;
    }

    const userPassHash = user.password;
    const isValid = await comparePassword(req.body.password, userPassHash);

    if (!isValid) {
        res.status(401);
        res.json({ message: 'Password was incorrect' });
        return;
    }

    const token = createJWT(user);
    res.status(200);
    res.json({ token });
}