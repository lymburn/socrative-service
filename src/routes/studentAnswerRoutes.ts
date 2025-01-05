import express from "express";
import { submitStudentAnswer, getStudentAnswers } from "../controllers/studentAnswerController";

const router = express.Router();

router.post("/", submitStudentAnswer);
router.get("/:studentId", getStudentAnswers);

export default router;