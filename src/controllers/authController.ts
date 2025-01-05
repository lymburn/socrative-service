import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { findUserByEmail, createUser, User } from "../models/user";
import { getDbInstance } from "../database";
import { generateUniqueRoomId } from "../utils"
import { createRoom, findRoomsByUserId } from "../models/room";
import { createStudent, findStudentById } from "../models/student";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDbInstance();

    try {
        const existingUser = await findUserByEmail(db, email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserId = await createUser(db, { email, password: hashedPassword });

        // Generate a unique room ID for the user
        const roomId = await generateUniqueRoomId(db, 5);
        await createRoom(db, roomId, newUserId);
        const rooms = await findRoomsByUserId(db, newUserId);

        if (!rooms) {
            // Handle unexpected case where room creation succeeded but retrieval failed
            return res.status(500).json({ error: "User registration failed, please try again later." });
        }

        res.status(201).json({
            user: {
                id: newUserId,
                email: email,
                rooms: rooms
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDbInstance();

    try {
        const user = await findUserByEmail(db, email);
        if (!user || !user.id) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                rooms: user.rooms
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const joinRoom = async (req: Request, res: Response): Promise<void> => {
    const { name, roomId } = req.body;

    const db = await getDbInstance();

    try {
        const studentId = await createStudent(db, name, roomId);
        const createdStudent = findStudentById(db, studentId);

        res.status(201).json({ student: createdStudent });
    } catch (error) {
        console.error("Failed to join room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}