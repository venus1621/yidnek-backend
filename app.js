import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import routes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "dev-secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
        "mongodb+srv://venushailemeskel2_db_user:EnkJfmHa6IIzMAo1@cluster0.5qhgkss.mongodb.net/"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

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

