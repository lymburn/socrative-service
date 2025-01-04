import { Database } from "sqlite";
import { Answer } from "./answer";

export interface Question {
    id: number;
    question: string;
    points: number;
    answers: Answer[];
}

export const createQuestion = async (
    db: Database,
    quizId: number,
    question: Question
): Promise<number> => {
    const { question: questionText, points } = question;
    const result = await db.run(
        `
        INSERT INTO questions (quiz_id, question, points)
        VALUES (?, ?, ?)
        `,
        [quizId, questionText, points]
    );

    if (!result.lastID) {
        throw new Error("Failed to create question. No ID was returned.");
    }

    return result.lastID;
};
