import { Database } from "sqlite";

export interface Room {
    id: number;
    room_id: string;
    user_id: number;
}

export const createRoom = async (db: Database, room_id: string, user_id: number): Promise<void> => {
    await db.run(
        "INSERT INTO rooms (room_id, user_id) VALUES (?, ?)",
        [room_id, user_id]
    );
};

export const findRoomsByUserId = async (db: Database, user_id: number): Promise<Room[]> => {
    return await db.all<Room[]>(
        "SELECT * FROM rooms WHERE user_id = ?",
        [user_id]
    );
};

export const findRoomByRoomId = async (db: Database, room_id: string): Promise<Room | undefined> => {
    return await db.get<Room>(
        "SELECT * FROM rooms WHERE room_id = ?",
        [room_id]
    );
};