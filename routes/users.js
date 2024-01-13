import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//read routes:

//Query strings
router.get("/:id", verifyToken, getUser); // gets a specific ID from frontend to be used to get something from DB
router.get("/:id/friends", verifyToken, getUserFriends);

//update:
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // add/remove a friend by getting user and friend ID

export default router;
