import prisma from "../db";
import { NextFunction, Request, Response } from "express";

export const getAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Gets all reviews made by logged in user
    try {
        const reviews = await prisma.review.findMany({
            where: {
                userId: req.user.id
            }
        });

        res.status(200);
        res.json({ data: reviews });
    } catch (e) {
        next(e);
    }
}

export const getOneReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const review = await prisma.review.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        res.status(200);
        res.json({ data: review })
    } catch (e) {
        next(e);
    }
}

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const review = await prisma.review.create({
            data: {
                title: req.body.title,
                body: req.body.body,
                score: req.body.score,
                boardGameId: req.body.boardGameId,
                userId: req.user.id
            }
        });

        res.status(200);
        res.json({ data: review });
    } catch (e) {
        next(e);
    }
}

export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updated = await prisma.review.update({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            data: req.body
        });

        if (!updated) {
            res.status(401);
            res.json({ message: "Unable to update reviews not made by you" });
        } else {
            res.status(200);
            res.json({ data: updated });
        }
    } catch (e) {
        next(e);
    }
}

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deleted = await prisma.review.delete({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!deleted) {
            res.status(401);
            res.json({ message: "Unable to delete reviews not made by you" });
        } else {
            res.status(200);
            res.json({ data: deleted });
        }

    } catch (e) {
        next(e);
    }
}
