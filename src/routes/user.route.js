import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = Router()
router.get("/logout", logoutUser)
router.post('/login', loginUser)
router.post('/register', registerUser)

export default router