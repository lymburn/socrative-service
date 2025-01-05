import express from "express";
import { createNewQuizSession, deleteQuizSession, getActiveSessionByRoom, getQuizSessionResults } from "../controllers/quizSessionController";

const router = express.Router();

router.post("/", createNewQuizSession);
router.get('/', getActiveSessionByRoom);
router.delete("/:sessionId", deleteQuizSession);
router.get("/:sessionId/results", getQuizSessionResults);

export default router;