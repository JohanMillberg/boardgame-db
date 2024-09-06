import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import prisma from '../db';

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 5);
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}

export const createJWT = (user: User): string => {
    const jwtSecret = process.env.JWT_SECRET as Secret;
    const token = jwt.sign({
        id: user.id,
        username: user.username
    },
        jwtSecret
    )
    return token;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET as Secret;

    if (!bearer) {
        res.status(400);
        res.json({ message: "Not authorized" });
        return;
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401);
        res.json({ message: "Invalid token" });
        return;
    }

    try {
        const user = jwt.verify(token, jwtSecret) as JwtPayload;
        req.user = user.id;
        next();
    }

    catch (e) {
        res.status(401);
        res.json({ message: "Invalid token", error: e });
        return;
    }
}

export const checkIfAdmin = async (userId: string): Promise<boolean> => {
    const admins = await prisma.user.findMany({
        where: {
            userType: "ADMIN"
        }
    });

    const adminIds = admins.reduce((allAdminIds: string[], admin: User) => {
        return [...allAdminIds, ...admin.id]
    }, []);

    return adminIds.includes(userId)
}