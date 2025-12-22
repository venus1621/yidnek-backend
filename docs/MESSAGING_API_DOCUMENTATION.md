# 📬 Messaging API Documentation

**Backend URL:** `https://yidnek-backend.onrender.com`

---

## 🔐 Authentication

All messaging endpoints require authentication via session cookies. The user must be logged in first.

### Login
```http
POST /login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "roleName": "teacher",
  "sundaySchoolId": "...",
  "teacherId": "..."
}
```

> ⚠️ Make sure to include `credentials: 'include'` in all fetch requests to send session cookies.

---

## 💬 Conversation Endpoints

### 1. Create or Get 1-on-1 Conversation
```http
POST /api/conversations
Content-Type: application/json

{
  "participantId": "USER_ID_TO_CHAT_WITH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "conversation_id",
    "participants": [
      { "_id": "user1_id", "username": "user1" },
      { "_id": "user2_id", "username": "user2" }
    ],
    "isGroup": false,
    "lastMessage": null,
    "createdAt": "2025-12-22T...",
    "updatedAt": "2025-12-22T..."
  },
  "existing": false
}
```

---

### 2. Create Group Conversation
```http
POST /api/conversations/group
Content-Type: application/json

{
  "participantIds": ["user_id_1", "user_id_2", "user_id_3"],
  "groupName": "Study Group",
  "sundaySchoolId": "optional_sunday_school_id"
}
```

---

### 3. Get All My Conversations
```http
GET /api/conversations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "conversation_id",
      "participants": [...],
      "isGroup": false,
      "groupName": null,
      "lastMessage": {
        "_id": "message_id",
        "content": "Hello!",
        "sender": { "_id": "...", "username": "John" }
      },
      "unreadCount": 3,
      "updatedAt": "2025-12-22T..."
    }
  ]
}
```

---

### 4. Get Single Conversation
```http
GET /api/conversations/:conversationId
```

---

### 5. Add Participants to Group
```http
POST /api/conversations/:conversationId/participants
Content-Type: application/json

{
  "participantIds": ["new_user_id_1", "new_user_id_2"]
}
```

---

### 6. Leave Group Conversation
```http
DELETE /api/conversations/:conversationId/leave
```

---

## 📨 Message Endpoints

### 1. Send Message (Text or Files)
```http
POST /api/messages
Content-Type: multipart/form-data

conversationId: "conversation_id"
content: "Hello, how are you?"
files: [file1, file2, ...]  (optional, max 5 files, 20MB each)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "conversationId": "...",
    "sender": { "_id": "...", "username": "John" },
    "content": "Hello, how are you?",
    "messageType": "TEXT",
    "files": [],
    "readBy": [{ "user": "sender_id", "readAt": "..." }],
    "createdAt": "2025-12-22T..."
  }
}
```

---

### 2. Get Messages by Conversation
```http
GET /api/messages/:conversationId
```

**Response:**
```json
[
  {
    "_id": "message_id",
    "conversationId": "...",
    "sender": { "_id": "...", "username": "John" },
    "content": "Hello!",
    "messageType": "TEXT",
    "files": [],
    "readBy": [...],
    "createdAt": "2025-12-22T10:00:00Z"
  },
  {
    "_id": "message_id_2",
    "content": "Hi there!",
    "sender": { "_id": "...", "username": "Jane" },
    "messageType": "TEXT",
    "createdAt": "2025-12-22T10:01:00Z"
  }
]
```

---

### 3. Mark Messages as Read
```http
PUT /api/messages/:conversationId/read
```

---

## 🔌 Socket.IO Integration

### Connect to Socket Server

```javascript
import { io } from "socket.io-client";

const socket = io("https://yidnek-backend.onrender.com", {
  withCredentials: true,
});

// Connection successful
socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
  
  // Register user for notifications (call after login)
  socket.emit("joinUser", currentUserId);
});
```

---

## 📤 Events to EMIT (Client → Server)

### 1. Register User (Required after login)
```javascript
socket.emit("joinUser", userId);
```

### 2. Join Conversation Room
```javascript
// Call when entering a chat screen
socket.emit("joinConversation", conversationId);
```

### 3. Leave Conversation Room
```javascript
// Call when leaving a chat screen
socket.emit("leaveConversation", conversationId);
```

### 4. Typing Indicator
```javascript
// When user starts typing
socket.emit("typing", { 
  conversationId: "...", 
  userId: currentUserId 
});

// When user stops typing (after delay or blur)
socket.emit("stopTyping", { 
  conversationId: "...", 
  userId: currentUserId 
});
```

### 5. Get Online Users
```javascript
socket.emit("getOnlineUsers", (onlineUserIds) => {
  console.log("Online users:", onlineUserIds);
});
```

### 6. Check If User is Online
```javascript
socket.emit("isUserOnline", userId, (isOnline) => {
  console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);
});
```

---

## 📥 Events to LISTEN (Server → Client)

### 1. New Message
```javascript
socket.on("newMessage", (message) => {
  console.log("New message received:", message);
  // {
  //   _id: "...",
  //   conversationId: "...",
  //   sender: { _id: "...", username: "John" },
  //   content: "Hello!",
  //   messageType: "TEXT",
  //   files: [],
  //   createdAt: "..."
  // }
});
```

### 2. Notification (When not in conversation)
```javascript
socket.on("notification", (data) => {
  console.log("New notification:", data);
  // {
  //   type: "NEW_MESSAGE",
  //   conversationId: "...",
  //   messageId: "...",
  //   from: "sender_id",
  //   senderName: "John",
  //   preview: "Hello, how are...",
  //   createdAt: "..."
  // }
});
```

### 3. User Typing
```javascript
socket.on("userTyping", ({ conversationId, userId, isTyping }) => {
  if (isTyping) {
    // Show "User is typing..."
  } else {
    // Hide typing indicator
  }
});
```

### 4. User Online/Offline Status
```javascript
socket.on("userOnline", ({ userId, online }) => {
  console.log(`User ${userId} came online`);
});

socket.on("userOffline", ({ userId, online }) => {
  console.log(`User ${userId} went offline`);
});
```

### 5. Messages Read Receipt
```javascript
socket.on("messagesRead", ({ conversationId, userId, readAt }) => {
  // Update UI to show messages were read
});
```

### 6. New Conversation Created
```javascript
socket.on("newConversation", (conversation) => {
  // Add new conversation to list
});
```

---

## 💻 Complete React Example

```javascript
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = "https://yidnek-backend.onrender.com";

export default function ChatApp({ currentUserId }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    socketRef.current = io(API_URL, { withCredentials: true });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinUser", currentUserId);
    });

    // Listen for new messages
    socketRef.current.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing
    socketRef.current.on("userTyping", ({ conversationId, userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [conversationId]: isTyping ? userId : null,
      }));
    });

    // Listen for notifications
    socketRef.current.on("notification", (data) => {
      // Show toast/notification
      console.log("New message from:", data.senderName);
    });

    return () => socketRef.current.disconnect();
  }, [currentUserId]);

  // Join conversation room when active changes
  useEffect(() => {
    if (activeConversation) {
      socketRef.current.emit("joinConversation", activeConversation);
      fetchMessages(activeConversation);
    }
    return () => {
      if (activeConversation) {
        socketRef.current.emit("leaveConversation", activeConversation);
      }
    };
  }, [activeConversation]);

  // Fetch conversations
  const fetchConversations = async () => {
    const res = await fetch(`${API_URL}/api/conversations`, {
      credentials: "include",
    });
    const data = await res.json();
    setConversations(data.data);
  };

  // Fetch messages
  const fetchMessages = async (convId) => {
    const res = await fetch(`${API_URL}/api/messages/${convId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setMessages(data);
  };

  // Send message
  const sendMessage = async () => {
    const formData = new FormData();
    formData.append("conversationId", activeConversation);
    formData.append("content", newMessage);

    await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    setNewMessage("");
    socketRef.current.emit("stopTyping", {
      conversationId: activeConversation,
      userId: currentUserId,
    });
  };

  // Handle typing
  const handleTyping = () => {
    socketRef.current.emit("typing", {
      conversationId: activeConversation,
      userId: currentUserId,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", {
        conversationId: activeConversation,
        userId: currentUserId,
      });
    }, 2000);
  };

  return (
    <div>
      {/* Your chat UI here */}
    </div>
  );
}
```

---

## 🔧 React Native Example

```javascript
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_URL = "https://yidnek-backend.onrender.com";

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      if (userId) {
        socketRef.current.emit("joinUser", userId);
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  return { socket: socketRef.current, isConnected };
};

// Usage in component:
// const { socket, isConnected } = useSocket(currentUserId);
```

---

## 📋 Quick Reference Table

| Action | Method | Endpoint |
|--------|--------|----------|
| Login | POST | `/login` |
| Logout | POST | `/logout` |
| Get Conversations | GET | `/api/conversations` |
| Create 1-on-1 Chat | POST | `/api/conversations` |
| Create Group Chat | POST | `/api/conversations/group` |
| Get Single Conversation | GET | `/api/conversations/:id` |
| Add Group Members | POST | `/api/conversations/:id/participants` |
| Leave Group | DELETE | `/api/conversations/:id/leave` |
| Get Messages | GET | `/api/messages/:conversationId` |
| Send Message | POST | `/api/messages` |
| Mark as Read | PUT | `/api/messages/:conversationId/read` |

---

## 📡 Socket Events Summary

### Client Emits (Send to Server)
| Event | Payload | Description |
|-------|---------|-------------|
| `joinUser` | `userId` | Register for notifications |
| `joinConversation` | `conversationId` | Join chat room |
| `leaveConversation` | `conversationId` | Leave chat room |
| `typing` | `{ conversationId, userId }` | Start typing |
| `stopTyping` | `{ conversationId, userId }` | Stop typing |
| `getOnlineUsers` | `callback(users[])` | Get online users list |
| `isUserOnline` | `userId, callback(bool)` | Check user status |

### Server Emits (Receive from Server)
| Event | Payload | Description |
|-------|---------|-------------|
| `newMessage` | `message object` | New message in conversation |
| `notification` | `{ type, conversationId, ... }` | Push notification |
| `userTyping` | `{ conversationId, userId, isTyping }` | Typing indicator |
| `userOnline` | `{ userId, online: true }` | User came online |
| `userOffline` | `{ userId, online: false }` | User went offline |
| `messagesRead` | `{ conversationId, userId, readAt }` | Read receipt |
| `newConversation` | `conversation object` | New conversation created |

---

## ⚠️ Important Notes

1. **Always include `credentials: 'include'`** in all fetch requests to send session cookies
2. **Call `socket.emit("joinUser", userId)`** immediately after successful login
3. **Call `socket.emit("joinConversation", id)`** when opening/viewing a chat
4. **Call `socket.emit("leaveConversation", id)`** when navigating away from chat
5. Messages are sorted by `createdAt` ascending (oldest first)
6. **File uploads:** Images, PDFs, videos supported - max 20MB each, max 5 files per message
7. **Message types:** `TEXT`, `FILE`, `IMAGE`, `MIXED` (text + files)

---

## 🔒 Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `400` - Bad request (missing required fields)
- `401` - Authentication required (not logged in)
- `404` - Resource not found
- `500` - Server error

---

**Backend Status:** ✅ Online  
**Backend URL:** https://yidnek-backend.onrender.com

---

*Last Updated: December 22, 2025*

