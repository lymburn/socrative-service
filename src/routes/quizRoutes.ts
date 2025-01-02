import express from "express";
import { createNewQuiz, getQuizzesForUser, getQuizById, deleteQuizById } from "../controllers/quizController";

const router = express.Router();

router.post("/", createNewQuiz);
router.get("/", getQuizzesForUser);
router.get("/:quizId", getQuizById);
router.delete("/:quizId", deleteQuizById);

export default router;