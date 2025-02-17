import { Database } from "sqlite";

/**
 * Generates a unique room ID by checking for collisions in the database.
 */
export async function generateUniqueRoomId(db: Database, length: number): Promise<string> {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const generateCode = () =>
        Array.from({ length }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");

    let roomId: string = "";
    let isUnique = false;

    while (!isUnique) {
        roomId = generateCode();
        const result = await db.get("SELECT room_id FROM rooms WHERE room_id = ?", [roomId]);
        if (!result) {
            isUnique = true;
        }
    }

    return roomId;
}