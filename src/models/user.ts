import { Database } from "sqlite";
import { Room } from "./room";

export interface User {
    id?: number;
    email: string;
    password: string;
    rooms?: Room[];
}

export const findUserByEmail = async (db: Database, email: string): Promise<User | undefined> => {
    // Fetch user
    const userRow = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!userRow) {
        // No user found with this email
        return undefined;
    }

    const user: User = {
        id: userRow.id,
        email: userRow.email,
        password: userRow.password,
        rooms: [],
    };

    // Fetch all rooms that belong to this user
    const roomRows = await db.all("SELECT * FROM rooms WHERE user_id = ?", [
        userRow.id,
    ]);

    // Convert each row into a Room object
    user.rooms = roomRows.map((r: any) => ({
        id: r.id,
        roomId: r.room_id,
        userId: r.user_id,
    }));

    return user;
};

export const createUser = async (db: Database, user: User): Promise<number> => {
    const result = await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [user.email, user.password]);

    if (!result.lastID) {
        throw new Error("Failed to create user. No ID was returned.");
    }

    return result.lastID;
};