# 📡 Real-Time Sync Strategy

## 📌 Overview

The application uses Socket.IO for real-time synchronization.

Real-time is implemented for **task-level operations only**.  
Boards and lists use standard REST updates.

---

## 🏗 Architecture Model

Real-time flow:

Client connects with JWT  
↓  
Server verifies token  
↓  
Client joins board room  
↓  
Server emits task events  
↓  
All connected clients update UI  

Each board acts as an isolated real-time room.

---

## 🔐 Secure Socket Authentication

- JWT sent during handshake  
- Server verifies token  
- `userId` attached to socket  
- Only authenticated users can join rooms  

---

## 🏠 Board-Scoped Rooms

When a board loads:

socket.emit("join_board", boardId)


Server executes:

socket.join(boardId)


Ensures:

- Board-level isolation  
- No cross-board event leakage  
- Scalable room-based broadcasting  

---

## 🔄 Task-Level Events

Socket events emitted:

- task_created  
- task_deleted  
- task_moved  
- task_moved_across  
- task_assigned  
- task_unassigned  
- activity_created  

Boards and lists rely on REST updates.

---

## 🔁 Example Flow

### Task Creation

1. Client sends REST request  
2. Server updates database  
3. Activity logged  
4. Event emitted to board room  
5. All clients update state  

### Drag & Drop

- Active client uses optimistic update  
- Server updates DB transaction-safe  
- Event emitted to other clients  

---

## 🧠 Design Characteristics

- Event-driven architecture  
- Board-scoped isolation  
- JWT-secured handshake  
- Optimistic UI updates  
- Server-authoritative database  
- No polling  

---

## 📈 Scalability

To scale real-time:

- Use Redis adapter for multi-instance Socket.IO  
- Enable sticky sessions behind load balancer  
- Use managed infrastructure  

---

## 🏆 Summary

The real-time system:

- Uses Socket.IO with JWT authentication  
- Isolates communication per board  
- Synchronizes task updates instantly  
- Maintains transactional consistency  
- Avoids unnecessary real-time overhead  