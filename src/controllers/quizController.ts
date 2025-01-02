import { Request, Response } from "express";
import { getDbInstance } from "../database";
import { createQuiz, deleteQuiz, findQuizzesByUserId, findQuizById } from "../models/quiz";
import { createQuestion } from "../models/question";
import { createAnswer } from "../models/answer";

// Create a new quiz
export const createNewQuiz = async (req: Request, res: Response): Promise<any> => {
    const { quiz } = req.body;

    const db = await getDbInstance();

    try {
        const quizId = await createQuiz(db, quiz);

        // Insert questions and answers
        for (const question of quiz.questions) {
            const { question: questionText, points, answers, correctIndex } = question;

            // Validate question format
            if (!questionText || typeof points !== "number" || !Array.isArray(answers) || answers.length !== 4) {
                return res.status(400).json({ error: "Invalid question format" });
            }

            // Create the question
            const questionId = await createQuestion(db, quizId, question);

            // Create answers
            for (const answer of question.answers) {
                await createAnswer(db, questionId, answer);
            }
        }

        // Retrieve created quiz
        const createdQuiz = await findQuizById(db, quizId);

        res.status(201).json({
            quiz: createdQuiz 
        });
    } catch (error) {
        console.error("Failed to create quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get quizzes for a user
export const getQuizzesForUser = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.query;

    const db = await getDbInstance();

    try {
        const quizzes = await findQuizzesByUserId(db, Number(userId));
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("Failed to retrieve quizzes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a quiz by its id
export const deleteQuizById = async (req: Request, res: Response): Promise<any> => {
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