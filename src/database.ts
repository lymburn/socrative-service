import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const initDb = async (): Promise<Database> => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database,
    });

    // Create users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    console.log("Database initialized successfully");
    return db;
};

export default initDb;