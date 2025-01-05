import { Request, Response } from "express";
import { getDbInstance } from "../database";
import { createQuizSession, findActiveQuizSessionByRoom, findQuizSessionById, deleteQuizSessionById } from "../models/quizSession";
import { findQuizById } from "../models/quiz";
import { findRoomByRoomId } from "../models/room";
import { buildQuizSessionResult } from "../models/quizSessionResult";

// Launch a new quiz session
export const createNewQuizSession = async (req: Request, res: Response): Promise<void> => {
    const { quizId, roomId } = req.body;
    const db = await getDbInstance();

    try {
        // Validate quiz and room existence
        const quiz = await findQuizById(db, quizId);
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found." });
            return;
        }

        const room = await findRoomByRoomId(db, roomId);
        if (!room) {
            res.status(404).json({ error: "Room not found." });
            return;
        }

        // Create a new quiz session
        const sessionId = await createQuizSession(db, quizId, roomId);

        // Retrieve created quiz session
        const createdQuizSession = await findQuizSessionById(db, sessionId);

        res.status(201).json({
            session: createdQuizSession 
        });
    } catch (error) {
        console.error("Failed to launch quiz session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// End a quiz session
export const deleteQuizSession = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    const db = await getDbInstance();

    try {
        // Validate session existence
        const session = await findQuizSessionById(db, Number(sessionId));
        if (!session) {
            res.status(404).json({ error: "Quiz session not found." });
            return;
        }

        // Delete the session
        await deleteQuizSessionById(db, Number(sessionId));
        res.sendStatus(204);
    } catch (error) {
        console.error("Failed to delete quiz session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getActiveSessionByRoom = async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.query;

    const db = await getDbInstance();

    try {
        const session = await findActiveQuizSessionByRoom(db, String(roomId));

        if (!session) {
            res.status(404).json({ error: "No active session found for this room." });
            return;
        }

        res.status(200).json({ 
            session: session 
        });
    } catch (error) {
        console.error("Failed to retrieve active session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getSessionById = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.query;

    const db = await getDbInstance();

    try {
        const session = await findQuizSessionById(db, Number(sessionId));

        if (!session) {
            res.status(404).json({ error: "No session found" });
            return;
        }

        res.status(200).json({ 
            session: session 
        });
    } catch (error) {
        console.error("Failed to retrieve session:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

/**
 * Controller to fetch the results of a quiz session.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getQuizSessionResults = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    const db = await getDbInstance();

    try {
        const results = await buildQuizSessionResult(db, Number(sessionId));

        if (!results) {
            res.status(404).json({ error: `Quiz session with ID ${sessionId} not found.` });
            return;
        }

        res.status(200).json({
            quizSessionResult: results
        });
    } catch (error) {
        console.error("Failed to fetch quiz session results:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};