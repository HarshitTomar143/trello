# 🧠 Backend Architecture

## 📌 Overview

The backend is built using:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Socket.IO
- JWT Authentication
- bcrypt

It follows a layered, modular architecture with transaction safety and real-time synchronization.

---

## 🏗 Architecture Principles

- Layered request flow (Route → Controller → DB → Socket)
- Stateless JWT authentication
- Strict resource ownership validation
- Transaction-safe mutations
- Board-scoped real-time rooms
- Modular folder structure

---

## 📂 Folder Structure

backend/
├── prisma/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│ ├── services/
│ ├── socket/
│ └── index.ts


Separation between:

- Routing
- Business logic
- Database layer
- Real-time layer
- Authentication

---

## 🔐 Authentication

- Passwords hashed using bcrypt
- JWT generated on login
- Token sent via `Authorization: Bearer`
- Middleware verifies token and attaches `userId`

Stateless authentication enables horizontal scalability.

---

## 🧱 Ownership & Security

Before every mutation:

1. Resource is fetched  
2. Ownership is validated  
3. Operation executed  
4. Event emitted  

Ensures strict board-level isolation and multi-user security.

---

## 🗄 Database Layer

Prisma ORM is used for:

- Type-safe queries  
- Relationship handling  
- Schema migrations  
- Transactions  

### Transaction Safety

Used for:

- Task reordering  
- Cross-list moves  
- Position recalculation  

Ensures:

- No duplicate positions  
- No ordering gaps  
- Consistent concurrent updates  

---

## ⚡ Real-Time Integration

### Secure Socket Authentication

- JWT verified during handshake  
- `userId` attached to socket  

### Board-Scoped Rooms

socket.join(boardId)


Events are isolated per board.

### Emitted Events

- task_created  
- task_deleted  
- task_moved  
- task_moved_across  
- task_assigned  
- activity_created  

Ensures instant multi-user synchronization.

---

## 📜 REST API Structure

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Boards
- GET `/api/boards`
- POST `/api/boards`

### Lists
- GET `/api/lists/:boardId`
- POST `/api/lists`

### Tasks
- POST `/api/tasks`
- DELETE `/api/tasks/:taskId`
- PATCH `/api/tasks/:taskId/move`
- PATCH `/api/tasks/:taskId/move-across`

---

## 📈 Scalability Readiness

- Stateless JWT design  
- Indexed database fields  
- Transaction-safe ordering  
- Redis adapter ready for socket scaling  

---

## 🚀 Summary

The backend demonstrates:

- Layered modular architecture  
- Secure JWT authentication  
- Strict ownership validation  
- Transaction-safe ordering logic  
- Event-driven real-time updates  
- Production-ready folder structure