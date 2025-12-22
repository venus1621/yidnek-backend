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
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
});

// Track online users: { odId: Set of socket IDs }
const onlineUsers = new Map();

// Make io and onlineUsers available in controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  let currentUserId = null;

  // Join personal notification room & track online status
  socket.on("joinUser", (userId) => {
    currentUserId = userId;
    socket.join(`user:${userId}`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast online status to all connected clients
    io.emit("userOnline", { userId, online: true });

    console.log(`User ${userId} is now online`);
  });

  // Join conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);

    // Notify others in conversation that user joined
    socket.to(`conversation:${conversationId}`).emit("userJoinedConversation", {
      conversationId,
      odId: currentUserId,
    });
  });

  // Leave conversation room
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  // Typing indicator - start typing
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit("userTyping", {
      conversationId,
      userId,
      isTyping: true,
    });
  });

  // Typing indicator - stop typing
  socket.on("stopTyping", ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit("userTyping", {
      conversationId,
      userId,
      isTyping: false,
    });
  });

  // Mark messages as read (real-time)
  socket.on("markRead", ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit("messagesRead", {
      conversationId,
      userId,
      readAt: new Date(),
    });
  });

  // Get online users list
  socket.on("getOnlineUsers", (callback) => {
    const onlineUserIds = Array.from(onlineUsers.keys());
    if (typeof callback === "function") {
      callback(onlineUserIds);
    }
  });

  // Check if specific user is online
  socket.on("isUserOnline", (userId, callback) => {
    const isOnline = onlineUsers.has(userId) && onlineUsers.get(userId).size > 0;
    if (typeof callback === "function") {
      callback(isOnline);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    // Remove from online users
    if (currentUserId && onlineUsers.has(currentUserId)) {
      onlineUsers.get(currentUserId).delete(socket.id);

      // If no more sockets for this user, they're offline
      if (onlineUsers.get(currentUserId).size === 0) {
        onlineUsers.delete(currentUserId);

        // Broadcast offline status
        io.emit("userOffline", { userId: currentUserId, online: false });
        console.log(`User ${currentUserId} is now offline`);
      }
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
