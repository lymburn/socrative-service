import { Request, Response } from "express";
import { getDbInstance } from "../database";
import { createStudentAnswer, findStudentAnswersByStudentId, } from "../models/studentAnswer";

/**
 * Submits a student's answer to a specific question.
 */
export const submitStudentAnswer = async (req: Request, res: Response): Promise<void> => {
    const { studentId, questionId, answerId } = req.body;

    const db = await getDbInstance();

    try {
        await createStudentAnswer(db, studentId, questionId, answerId);
        const createdStudentAnswer = await findStudentAnswersByStudentId(db, Number(studentId));

        res.status(201).json({ studentAnswer: createdStudentAnswer });
    } catch (error) {
        console.error("Failed to submit student answer:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

/**
 * Retrieves all answers submitted by a particular student.
 */
export const getStudentAnswers = async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;

    const db = await getDbInstance();

    try {
        const studentAnswers = await findStudentAnswersByStudentId(db, Number(studentId));
        res.status(200).json({ studentAnswers: studentAnswers });
    } catch (error) {
        console.error("Failed to fetch student answers:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};