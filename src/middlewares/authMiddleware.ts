import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * Authentication middleware that verifies the presence and validity of a JWT.
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Assume that the token is sent as "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        jwt.verify(token, JWT_SECRET);
        // If verification succeeds, simply proceed
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        res.status(400).json({ error: "Bad Request" });
    }
};