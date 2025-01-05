import { Database } from "sqlite";

/**
 * Represents an active session of a quiz in a particular room.
 */
export interface QuizSession {
    id: number;
    quizId: number;
    roomId: string;
}

/**
 * Creates a new quiz session for a specific quiz and room.
 */
export const createQuizSession = async (
    db: Database,
    quizId: number,
    roomId: number // or string, depending on your schema
): Promise<number> => {
    const result = await db.run(
        `
    INSERT INTO quiz_sessions (quiz_id, room_id, is_active)
    VALUES (?, ?, 0)
    `,
        [quizId, roomId]
    );

    if (!result.lastID) {
        throw new Error("Failed to create quiz session.");
    }

    return result.lastID;
};

/**
 * Finds a quiz session by its ID.
 */
export const findQuizSessionById = async (
    db: Database,
    sessionId: number
): Promise<QuizSession | undefined> => {
    return db.get<QuizSession>(
        `
    SELECT 
      id,
      quiz_id AS quizId,
      room_id AS roomId
    FROM quiz_sessions 
    WHERE id = ?
    `,
        [sessionId]
    );
};

/**
 * Finds an active quiz session for a particular room ID.
 */
export const findActiveQuizSessionByRoom = async (
    db: Database,
    roomId: string
): Promise<QuizSession | undefined> => {
    return db.get<QuizSession>(
        `
    SELECT
      id,
      quiz_id AS quizId,
      room_id AS roomId
    FROM quiz_sessions
    WHERE room_id = ?
    `,
        [roomId]
    );
};

/**
 * Deletes a quiz session by its ID.
 */
export const deleteQuizSessionById = async (
    db: Database,
    sessionId: number
): Promise<void> => {
    await db.run(
        `
    DELETE FROM quiz_sessions
    WHERE id = ?
    `,
        [sessionId]
    );
};