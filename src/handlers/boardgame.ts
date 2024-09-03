import { User } from '@prisma/client';
import prisma from '../db';
import { NextFunction, Request, Response } from 'express';
import { checkIfAdmin } from '../modules/auth';

export const getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const games = await prisma.boardGame.findMany();

        res.status(200);
        res.json({ data: games });
    } catch (e) {
        next(e);
    }
};

export const getOneGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const game = await prisma.boardGame.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.status(200);
        res.json({ date: game });
    } catch (e) {
        next(e);
    }
};

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userIsAdmin = checkIfAdmin(req.user);
        if (!userIsAdmin) {
            res.status(401);
            res.json({ message: "User not authorized to add games" })
            return;
        } else {
            const game = await prisma.boardGame.create({
                data: {
                    title: req.body.title
                }
            })

            res.status(200);
            res.json({ data: game });
        }
    } catch (e) {
        next(e);
    }
};

export const updateGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userIsAdmin = checkIfAdmin(req.user);

        if (!userIsAdmin) {
            res.status(401);
            res.json({ message: "User not authorized to perform updates" })
            return;
        } else {
            const updatedGame = await prisma.boardGame.update({
                where: {
                    id: req.params.id
                },
                data: req.body
            })
        }
    } catch (e) {
        next(e)
    }
};
