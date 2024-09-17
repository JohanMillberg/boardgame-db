import prisma from '../db';
import { NextFunction, Request, Response } from 'express';
import { comparePassword, createAuthCookies, hashPassword } from '../modules/auth';
import { User } from '@prisma/client';
import jwt, { Secret } from 'jsonwebtoken';
import { TokenContents } from '../types/token';
import { emitWarning } from 'process';

export const createNewUser = async (req: Request, res: Response) => {
    const user: User = await prisma.user.create({
        data: {
            username: req.body.username,
            password: await hashPassword(req.body.password)
        }
    })

    res.status(200);
    res.json({ data: user });
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

    createAuthCookies(res, user);

    res.status(200);
    res.json({ message: 'Cookies successfully created' });
}

export const refresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const refreshSecret = process.env['JWT_REFRESH_SECRET'] as Secret

    if (!refreshToken) {
        res.status(401);
        res.json({ error: 'Refresh token login required, please login' })
    };

    try {
        const user = jwt.verify(refreshToken, refreshSecret) as TokenContents;
        createAuthCookies(res, user)
        res.status(200);
        res.json({ message: 'Tokens successfully refreshed' });
    } catch (e) {
        next(e);
    };
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200);
};