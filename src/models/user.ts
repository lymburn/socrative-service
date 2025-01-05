import { Database } from "sqlite";
import { Room } from "./room";

/**
 * Represents a teacher user who can own rooms and quizzes.
 */
export interface User {
    id?: number;
    email: string;
    password: string;
    rooms?: Room[];
}

/**
 * Finds a user record by email, including their associated rooms.
 */
export const findUserByEmail = async (
    db: Database,
    email: string
): Promise<User | undefined> => {
    const userRow = await db.get<any>(
        `
    SELECT *
    FROM users
    WHERE email = ?
    `,
        [email]
    );

    if (!userRow) {
        return undefined;
    }

    const user: User = {
        id: userRow.id,
        email: userRow.email,
        password: userRow.password,
        rooms: [],
    };

    // Fetch the rooms for this user
    const roomRows = await db.all<any[]>(
        `
    SELECT id, room_id, user_id
    FROM rooms
    WHERE user_id = ?
    `,
        [userRow.id]
    );

    user.rooms = roomRows.map((r) => ({
        roomId: r.room_id,
        userId: r.user_id,
    }));

    return user;
};

/**
 * Creates a new user record with the provided email and hashed password.
 */
export const createUser = async (db: Database, user: User): Promise<number> => {
    const result = await db.run(
        `
    INSERT INTO users (email, password)
    VALUES (?, ?)
    `,
        [user.email, user.password]
    );

    if (!result.lastID) {
        throw new Error("Failed to create user. No ID was returned.");
    }

    return result.lastID;
};