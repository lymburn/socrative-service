import { Database } from "sqlite";

/**
 * Represents a "room" that a teacher can create, and students can join.
 */
export interface Room {
    roomId: string;
    userId: number;
}

/**
 * Creates a new room.
 */
export const createRoom = async (
    db: Database,
    roomId: string,
    userId: number
): Promise<void> => {
    await db.run(
        `
    INSERT INTO rooms (room_id, user_id)
    VALUES (?, ?)
    `,
        [roomId, userId]
    );
};

/**
 * Finds all rooms owned by a particular user ID.
 */
export const findRoomsByUserId = async (
    db: Database,
    userId: number
): Promise<Room[]> => {
    return db.all<Room[]>(
        `
    SELECT room_id AS roomId, user_id AS userId
    FROM rooms
    WHERE user_id = ?
    `,
        [userId]
    );
};

/**
 * Finds a room by its roomId.
 */
export const findRoomByRoomId = async (
    db: Database,
    roomId: string
): Promise<Room | undefined> => {
    return db.get<Room>(
        `
    SELECT room_id AS roomId, user_id AS userId
    FROM rooms
    WHERE room_id = ?
    `,
        [roomId]
    );
};