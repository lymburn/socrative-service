import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";
import { initializeDb } from "./database";
import authMiddleware from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
var cors = require('cors');

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/quiz", authMiddleware, quizRoutes);

// Initialize Database and Start Server
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
        process.exit(1); // Exit the process if database initialization fails
    });