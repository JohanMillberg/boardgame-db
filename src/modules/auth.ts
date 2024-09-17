import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import prisma from '../db';
import { Token, TokenConfig, TokenContents } from '../types/token';
import { CookieOptions } from '../types/cookie';

const tokenConfigs: Record<Token, TokenConfig> = {
    [Token.Access]: {
        secretEnvKey: 'JWT_ACCESS_SECRET',
        expiresIn: '15m'
    },
    [Token.Refresh]: {
        secretEnvKey: 'JWT_REFRESH_SECRET',
        expiresIn: '7d'
    }
};

const cookieConfigs: Record<Token, Omit<CookieOptions, 'secure'> & { name: string }> = {
    [Token.Access]: {
        name: 'accessToken',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    },
    [Token.Refresh]: {
        name: 'refreshToken',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};


export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 5);
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}

const createJWT = (user: TokenContents, jwtSecret: Secret, expiryTime: string): string => {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
    },
        jwtSecret,
        {
            expiresIn: expiryTime
        }
    );
    return token;
}

const createToken = (user: TokenContents, tokenType: Token): string => {
    const config = tokenConfigs[tokenType];
    const secret = process.env[config.secretEnvKey] as Secret;

    if (!secret) {
        throw new Error(`Environment variable ${config.secretEnvKey} is not set`);
    }

    const token = createJWT(user, secret, config.expiresIn);
    return token;
}

export const createAuthCookies = (res: Response, user: TokenContents): void => {
    Object.values(Token).forEach(tokenType => {
        const token = createToken(user, tokenType);
        const config = cookieConfigs[tokenType];

        res.cookie(config.name, token, {
            ...config,
            secure: process.env.NODE_ENV === 'production'
        });
    });
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const accessSecret = process.env.JWT_ACCESS_SECRET as Secret;

    if (!accessToken) {
        res.status(401);
        res.json({ message: "Access token required" });
        return;
    }

    try {
        const user = jwt.verify(accessToken, accessSecret) as TokenContents;
        req.user = user;
        next();
    }

    catch (e) {
        res.status(403);
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