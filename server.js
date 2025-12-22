import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io available in controllers
app.set("io", io);

// Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join personal notification room
  socket.on("joinUser", (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined user room`);
  });

  // Join conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Joined conversation ${conversationId}`);
  });

  socket.on("leaveConversation", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
