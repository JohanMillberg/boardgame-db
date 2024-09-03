import { Router } from "express";
import { createGame, getGames } from "./handlers/boardgame";

const router = Router();

// Review
router.get('/review', () => {
    console.log("Gets all reviews made by user");
});
router.get('/review/:id', () => {
    console.log("Gets one review");
});
router.post('/review', () => {
    console.log("Posts review");
});
router.put('/review/:id', () => {
    console.log("Updates review");
});

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
router.get('/game/:id', () => {
    console.log("Gets one game");
});
router.post('/game', createGame);
router.put('/game/:id', () => {
    console.log("Updates game");
});

export default router;