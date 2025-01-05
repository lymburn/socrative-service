import { Database } from "sqlite";

export interface QuizSession {
    id: number;
    quizId: number;
    roomId: string;
    isPaused: boolean;
}

// Create a new quiz session
export const createQuizSession = async (
    db: Database,
    quizId: number,
    roomId: number
): Promise<number> => {
    const result = await db.run(
        `
        INSERT INTO quiz_sessions (quiz_id, room_id, is_paused)
        VALUES (?, ?, 0)
        `,
        [quizId, roomId]
    );
    
    if (!result.lastID) {
        throw new Error("Failed to create quiz session.");
    }
    return result.lastID;
};

export const findQuizSessionById = async (
    db: Database,
    sessionId: number
): Promise<QuizSession | undefined> => {
    return await db.get(
        `
        SELECT * FROM quiz_sessions WHERE id = ?
        `,
        [sessionId]
    );
};

// Find an active quiz session by room ID
export const findActiveQuizSessionByRoom = async (
    db: Database,
    roomId: string
): Promise<QuizSession | undefined> => {
    return await db.get<QuizSession>(
        `
        SELECT
            id,
            quiz_id AS quizId,
            room_id AS roomId,
            is_paused AS isPaused
        FROM quiz_sessions
        WHERE room_id = ?
        `,
        [roomId]
    );
};

// Delete a quiz session by ID
export const deleteQuizSessionById = async (
    db: Database,
    sessionId: number
): Promise<void> => {
    await db.run(
        `
        DELETE FROM quiz_sessions WHERE id = ?
        `,
        [sessionId]
    );
};