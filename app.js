import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import routes from "./routes/index.js";

const app = express();

// 1. CORS must be first - before any routes or other middleware
// Allow ALL origins (use only for development/testing!)
app.use(cors({
  origin: true,              // allows any origin (wildcard *)
  credentials: true,         // still allows cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

// 2. Parse JSON
app.use(express.json());

// 3. Session (after CORS)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Required for HTTPS (Render is HTTPS)
      sameSite: "none", // Required for cross-origin cookies
      httpOnly: true,
    },
  })
);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Church Management System API", status: "online" });
});

export default app;