import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); //set up our routher, allows express to identify the routes are configured

router.post("/login", login);

export default router;
