import express from "express";
import { register, login, joinRoom } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login/teacher", login);
router.post("/login/student", joinRoom);

export default router;