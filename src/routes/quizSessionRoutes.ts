import express from "express";
import { createNewQuizSession, deleteQuizSession, getActiveSessionByRoom } from "../controllers/quizSessionController";

const router = express.Router();

router.post("/", createNewQuizSession);
router.get('/', getActiveSessionByRoom);
router.delete("/:sessionId", deleteQuizSession);

export default router;