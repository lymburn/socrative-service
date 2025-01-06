import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { getDbInstance } from "../database";
import { findUserByEmail, createUser } from "../models/user";
import { createRoom, findRoomsByUserId } from "../models/room";
import { createStudent, findStudentById } from "../models/student";
import { generateUniqueRoomId } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * Registers a new user and automatically creates a unique room for them.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return void res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDbInstance();

    try {
        const existingUser = await findUserByEmail(db, email);
        if (existingUser) {
            return void res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserId = await createUser(db, { email, password: hashedPassword });

        // Generate a unique room ID and create a room for the new user
        const roomId = await generateUniqueRoomId(db, 5);
        await createRoom(db, roomId, newUserId);
        const rooms = await findRoomsByUserId(db, newUserId);

        if (!rooms) {
            // In case room creation succeeded but retrieval failed
            res.status(500).json({ error: "User registration failed, please try again later." });
            return;
        }

        res.status(201).json({
            user: {
                id: newUserId,
                email: email,
                rooms: rooms,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Logs an existing user in and returns a JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return void res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDbInstance();

    try {
        const user = await findUserByEmail(db, email);
        if (!user || !user.id) {
            return void res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                rooms: user.rooms,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Allows a student to join a room by providing their name and room ID.
 */
export const joinRoom = async (req: Request, res: Response): Promise<void> => {
    const { name, roomId, sessionId } = req.body;

    const db = await getDbInstance();

    try {
        const studentId = await createStudent(db, name, roomId, Number(sessionId));
        const createdStudent = await findStudentById(db, studentId);

        res.status(201).json({ student: createdStudent });
    } catch (error) {
        console.error("Failed to join room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};