import { Database } from "sqlite";

export interface Room {
    id: number;
    roomId: string;
    userId: number;
}

export const createRoom = async (db: Database, roomId: string, userId: number): Promise<void> => {
    await db.run(
        "INSERT INTO rooms (room_id, user_id) VALUES (?, ?)",
        [roomId, userId]
    );
};

export const findRoomsByUserId = async (db: Database, userId: number): Promise<Room[]> => {
    return await db.all<Room[]>(
        "SELECT * FROM rooms WHERE user_id = ?",
        [userId]
    );
};