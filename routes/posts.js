import express from "express";
import { getFeedPosts, getUserPosts, likePosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**READ */
//populate the user's feed with posts
router.get("/", verifyToken, getFeedPosts);
//when on user's profile, populate feed with only relevant posts(USER POSTS)
router.get("/:userId/posts ", verifyToken, getUserPosts);

/**UPDATE */
router.patch("/:id/like", verifyToken, likePosts);

export default router;
