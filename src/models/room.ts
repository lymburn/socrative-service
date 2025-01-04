import { Database } from "sqlite";

export interface Room {
    roomId: string;
    userId: number;
}

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

export const findRoomsByUserId = async (
    db: Database,
    userId: number
): Promise<Room[]> => {
    return await db.all<Room[]>(
        `
        SELECT *
        FROM rooms
        WHERE user_id = ?
        `,
        [userId]
    );
};

export const findRoomByRoomId = async (
    db: Database,
    roomId: string
): Promise<Room | undefined> => {
    return await db.get<Room>(
        `
        SELECT *
        FROM rooms
        WHERE room_id = ?
        `,
        [roomId]
    );
};