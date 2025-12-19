import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import routes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors"; // ← Add this import

const app = express();

// Enable CORS - this fixes your error
app.use(
  cors({
    origin: "*", // ← This allows EVERY origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you use cookies/sessions
  })
);

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// ... rest of your code remains the same

// Routes
app.use("/", authRoutes);
app.use("/api", routes);
app.use("/dashboard", dashboardRoutes);
// Root route -> simple API info
app.get("/", (req, res) => {
  res.json({
    message: "Church Management System API",
    endpoints: {
      api: "/api",
      dashboard: "/dashboard",
      auth: "/login",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

export default app;

