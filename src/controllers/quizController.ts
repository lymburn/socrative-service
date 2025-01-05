import { Request, Response } from "express";
import { getDbInstance } from "../database";
import {createQuiz, deleteQuiz, findQuizzesByUserId, findQuizById } from "../models/quiz";
import { createQuestion } from "../models/question";
import { createAnswer } from "../models/answer";

/**
 * Creates a new quiz along with its questions and answers.
 */
export const createNewQuiz = async (req: Request, res: Response): Promise<void> => {
    const { quiz } = req.body;

    const db = await getDbInstance();

    try {
        // Create the quiz record
        const quizId = await createQuiz(db, quiz);

        // Add questions and answers
        for (const question of quiz.questions) {
            const questionId = await createQuestion(db, quizId, question);
            for (const answer of question.answers) {
                await createAnswer(db, questionId, answer);
            }
        }

        // Retrieve the newly created quiz
        const createdQuiz = await findQuizById(db, quizId);

        res.status(201).json({
            quiz: createdQuiz,
        });
    } catch (error) {
        console.error("Failed to create quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves all quizzes for a given user ID.
 */
export const getQuizzesForUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    const db = await getDbInstance();

    try {
        const quizzes = await findQuizzesByUserId(db, Number(userId));
        res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Failed to retrieve quizzes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves a single quiz by its ID.
 */
export const getQuizById = async (req: Request, res: Response): Promise<void> => {
    const { quizId } = req.params;

    const db = await getDbInstance();

    try {
        const quiz = await findQuizById(db, Number(quizId));
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found" });
            return;
        }

        res.status(200).json({ quiz });
    } catch (error) {
        console.error("Failed to retrieve quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Deletes a quiz by its ID.
 */
export const deleteQuizById = async (req: Request, res: Response): Promise<void> => {
    const { quizId } = req.params;

    const db = await getDbInstance();

    try {
        await deleteQuiz(db, Number(quizId));
        res.sendStatus(204);
    } catch (error) {
        console.error("Failed to delete quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};