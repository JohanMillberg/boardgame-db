import { Router } from "express";
import { body } from 'express-validator';
import { createGame, deleteGame, getGames, getOneGame, updateGame } from "./handlers/boardgame";
import { createReview, deleteReview, getAllReviews, getOneReview, updateReview } from "./handlers/review";
import { createComment, deleteComment, getAllComments, getOneComment, updateComment } from "./handlers/comment";
import { handleInputErrors } from "./modules/middleware";

const router = Router();

// Review
router.get('/review', getAllReviews);
router.get('/review/:id', getOneReview);
router.post('/review',
    body('title').isString(),
    body('body').isString(),
    body('score').isInt(),
    body('boardGameId').isString(),
    handleInputErrors,
    createReview);
router.put('/review/:id', updateReview);
router.delete('/review/:id', deleteReview);

// Comment
router.get('/comment', getAllComments);
router.get('/comment/:id', getOneComment);
router.post('/comment', createComment);
router.put('/comment/:id', updateComment);
router.delete('/comment/:id', deleteComment);

// Boardgame
router.get('/game', getGames);
router.get('/game/:id', getOneGame);
router.post('/game', createGame);
router.put('/game/:id', updateGame);
router.delete('/game/:id', deleteGame);

export default router;