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
            const { question: questionText, answers, correctIndex } = question;

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
        res.status(200).json({ 
            quizzes: quizzes 
        });
    } catch (error) {
        console.error("Failed to retrieve quizzes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get quiz by id
export const getQuizById = async (req: Request, res: Response): Promise<any> => {
    const { quizId } = req.params;

    const db = await getDbInstance();

    try {
        const quiz = await findQuizById(db, Number(quizId));
        res.status(200).json( {
            quiz: quiz
        });
    } catch (error) {
        console.error("Failed to retrieve quiz:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

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