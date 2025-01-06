import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";
import quizSessionRoutes from "./routes/quizSessionRoutes";
import { initializeDb } from "./database";
import { authMiddleware } from "./middlewares/authMiddleware";
import studentAnswerRoutes from "./routes/studentAnswerRoutes";

dotenv.config();

const app = express();
var cors = require('cors');

// Enable CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow only this origin
        credentials: true, // Allow cookies or other credentials
    })
);

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/quiz", authMiddleware, quizRoutes);
app.use("/quiz-session", authMiddleware, quizSessionRoutes);
app.use("/student-answer", studentAnswerRoutes);

// Initialize Database and start server
const PORT = process.env.PORT || 3000;

initializeDb()
    .then(() => {
        console.log("Database initialized successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize the database:", error);
        process.exit(1);
    });