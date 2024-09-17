import prisma from '../db';
import { Request, Response, NextFunction } from 'express';

export const getAllComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                userId: req.user.id
            }
        });

        res.status(200);
        res.json({ data: comments });
    } catch (e) {
        next(e);
    }
};

export const getOneComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.status(200);
        res.json({ data: comment });
    } catch (e) {
        next(e);
    }
};

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await prisma.comment.create({
            data: {
                content: req.body.content,
                userId: req.user.id
            }
        });

        res.status(200);
        res.json({ data: comment });
    } catch (e) {
        next(e);
    }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updated = await prisma.comment.update({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            data: req.body
        });

        if (!updated) {
            res.status(401);
            res.json({ message: "Unable to update comments not made by user" });
        } else {
            res.status(200);
            res.json({ data: updated });
        }
    } catch (e) {
        next(e);
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deleted = await prisma.comment.delete({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!deleted) {
            res.status(401);
            res.json({ message: "Unable to delete comments not made by user" })
        } else {
            res.status(200);
            res.json({ data: deleted });
        }
    } catch (e) {
        next(e);
    }
}
