import express from "express";
import { createNewQuiz, getQuizzesForUser, deleteQuizById } from "../controllers/quizController";

const router = express.Router();

router.post("/", createNewQuiz);
router.get("/", getQuizzesForUser);
router.delete("/:quizId", deleteQuizById);

export default router;