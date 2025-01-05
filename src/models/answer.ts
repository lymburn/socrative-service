import { Database } from "sqlite";

/**
 * Represents an individual answer option for a question.
 */
export interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

/**
 * Inserts a new answer record into the database.
 */
export const createAnswer = async (
    db: Database,
    questionId: number,
    answer: Answer
): Promise<number> => {
    const { text, isCorrect } = answer;
    const result = await db.run(
        `
        INSERT INTO answers (question_id, text, is_correct)
        VALUES (?, ?, ?)
        `,
        [questionId, text, isCorrect]
    );

    if (!result.lastID) {
        throw new Error("Failed to create answer. No ID was returned.");
    }

    return result.lastID;
};