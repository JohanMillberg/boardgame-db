import { Router } from "express";
import { createGame, deleteGame, getGames, getOneGame, updateGame } from "./handlers/boardgame";
import { createReview, deleteReview, getAllReviews, getOneReview, updateReview } from "./handlers/review";

const router = Router();

// Review
router.get('/review', getAllReviews);
router.get('/review/:id', getOneReview);
router.post('/review', createReview);
router.put('/review/:id', updateReview);
router.delete('/review/:id', deleteReview);

// Comment
router.get('/comment', () => {
    console.log("Gets all comments made by user");
});
router.get('/comment/:id', () => {
    console.log("Gets one comment");
});
router.post('/comment', () => {
    console.log("Posts comment");
});
router.put('/comment/:id', () => {
    console.log("Updates comment");
});

// Boardgame
router.get('/game', getGames);
router.get('/game/:id', getOneGame);
router.post('/game', createGame);
router.put('/game/:id', updateGame);
router.delete('/game/:id', deleteGame);

export default router;