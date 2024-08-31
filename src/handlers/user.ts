import prisma from '../db';
import { Request, Response } from 'express';

export const createNewUser = async (req: Request, res: Response) => {
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        }
    })

    res.json({ data: user })
}