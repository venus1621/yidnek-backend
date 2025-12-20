import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // For handling CORS
import routes from "./routes/index.js";

import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
// Initialize Express app
const app = express();

// Global Middleware
// Enable CORS - Allow requests from ANY origin (open to all websites)
app.use(
  cors({
    origin:
      "https://id-preview--434609bf-1572-4ee9-974d-d0c2f523b9f6.lovable.app", // Allows all origins (use specific domains in production for security)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required if using cookies or sessions
  })
);

// Parse JSON request bodies
app.use(express.json());
// Uncomment if you need URL-encoded form data
// app.use(express.urlencoded({ extended: true }));

// Uncomment if you need session support (currently disabled)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://venushailemeskel2_db_user:EnkJfmHa6IIzMAo1@cluster0.5qhgkss.mongodb.net/"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use("/", authRoutes); // Authentication routes (e.g., /login)
app.use("/api", routes); // Main API routes (e.g., /api/dioceses)

// Root route - Simple API welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Church Management System API",
    status: "online",
    endpoints: {
      auth: "/login",
      api: "/api",
      dashboard: "/dashboard",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack in dev only
  });
});

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

export default app;