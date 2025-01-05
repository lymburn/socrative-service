import { Database } from "sqlite";
import { Answer } from "./answer";

/**
 * Represents a quiz question containing multiple possible answers.
 */
export interface Question {
    id: number;
    question: string;
    answers: Answer[];
}

/**
 * Inserts a new question record into the database.
 */
export const createQuestion = async (
    db: Database,
    quizId: number,
    question: Question
): Promise<number> => {
    const { question: questionText } = question;
    const result = await db.run(
        `
        INSERT INTO questions (quiz_id, question)
        VALUES (?, ?)
        `,
        [quizId, questionText]
    );

    if (!result.lastID) {
        throw new Error("Failed to create question. No ID was returned.");
    }

    return result.lastID;
};