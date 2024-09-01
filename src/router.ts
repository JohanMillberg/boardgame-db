import { Router } from "express";

const router = Router();

// Review
router.get('/review', () => {
    console.log("Gets all reviews");
})

// Comment

export default router;