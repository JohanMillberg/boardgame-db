import prisma from '../db';
import { Request, Response } from 'express';

interface CreateUserRequest extends Request {
    body: {
        username: string;
        password: string;
    }
}

export const createNewUser = async (req: CreateUserRequest, res: Response) => {
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        }
    })

    res.json()
}