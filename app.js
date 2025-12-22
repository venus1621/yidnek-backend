import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import routes from "./routes/index.js";

const app = express();

// Trust proxy (required for Render and other proxies)
app.set("trust proxy", 1);

// 1. CORS must be first - before any routes or other middleware
app.use(cors({
  origin: true,              // allows any origin
  credentials: true,         // allows cookies/sessions
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
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin in production
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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