import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let dbInstance: Database | null = null;

/**
 * Returns a singleton instance of the database connection.
 */
export const getDbInstance = async (): Promise<Database> => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: "./database.sqlite",
            driver: sqlite3.Database,
        });

        // Enable foreign key constraints
        await dbInstance.exec("PRAGMA foreign_keys = ON;");
    }
          
    return dbInstance;
};

/**
 * Creates the necessary tables if they don't already exist.
 */
export const initializeDb = async (): Promise<void> => {
    const db = await getDbInstance();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id TEXT UNIQUE PRIMARY KEY,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL DEFAULT '',
      is_correct BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      room_id TEXT NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes (id),
      FOREIGN KEY (room_id) REFERENCES rooms (room_id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room_id TEXT NOT NULL,
      session_id INTEGER NOT NULL,
      FOREIGN KEY (room_id) REFERENCES rooms (room_id),
      FOREIGN KEY (session_id) REFERENCES quiz_sessions (id) ON DELETE CASCADE
    );
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS student_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      answer_id INTEGER,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
      FOREIGN KEY (answer_id) REFERENCES answers (id) ON DELETE CASCADE,
      UNIQUE (student_id, question_id)
    );
  `);
};