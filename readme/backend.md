🧠 Backend Architecture
📌 Overview

The backend of the Real-Time Task Collaboration Platform is built using:

Node.js

Express.js

TypeScript

Prisma ORM

PostgreSQL (Neon)

Socket.IO

JWT Authentication

bcrypt for password hashing

The architecture follows a layered, modular, and scalable design, ensuring:

Clear separation of concerns

Transaction-safe operations

Real-time event-driven synchronization

Strict ownership validation

Production-ready structure

🏗 Architectural Design Principles

The backend is designed around the following core principles:

Layered architecture

Stateless authentication (JWT)

Transaction safety for mutations

Board-scoped access control

Event-driven real-time updates

Prisma singleton pattern

Scalable folder structure

📂 Folder Structure
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── index.ts
│   │
│   ├── config/
│   │   └── prisma.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── board.controller.ts
│   │   ├── list.controller.ts
│   │   ├── task.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── board.routes.ts
│   │   ├── list.routes.ts
│   │   ├── task.routes.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   │
│   ├── services/
│   │   └── activity.service.ts
│   │
│   └── socket/
│       └── io.ts
│
├── .env
├── package.json
├── tsconfig.json


This structure enforces separation between:

Routing

Business logic

Database access

Real-time layer

Authentication

Services

🏛 Layered Architecture

The backend follows a layered request flow:

Route
  ↓
Controller
  ↓
Service (optional)
  ↓
Prisma ORM
  ↓
PostgreSQL
  ↓
Socket Emit

🔐 Authentication Layer
JWT-Based Authentication

Users register and login.

Passwords are hashed using bcrypt.

A JWT token is generated upon login.

Token is sent via Authorization: Bearer <token>.

Middleware

auth.middleware.ts:

Verifies JWT

Extracts user ID

Attaches req.userId

Protects all private routes

Key Design Benefit

Stateless authentication enables horizontal scaling without session storage.

🧱 Resource Ownership Model

Security is enforced at every mutation.

For example:

Fetch resource
↓
Validate ownership (board.ownerId === userId)
↓
Execute operation
↓
Emit real-time event


This ensures:

No cross-user access

Strict board-level isolation

Multi-user security compliance

🗄 Database Interaction Layer
Prisma ORM

Prisma is used for:

Type-safe database queries

Transaction handling

Relationship management

Schema migrations

Prisma Singleton Pattern

A single Prisma client instance is used to:

Prevent connection leaks

Ensure efficient pooling

Improve production stability

🔁 Transaction-Safe Mutations

Operations that affect ordering use:

prisma.$transaction()


Examples:

Move task within list

Move task across lists

Delete task (position recalculation)

Why Transactions?

They ensure:

No duplicate positions

No gaps in ordering

Consistent state across concurrent requests

⚡ Real-Time Architecture

The backend integrates Socket.IO for real-time collaboration.

🔐 Secure WebSocket Authentication

During socket handshake:

JWT token is verified

userId is attached to socket

Unauthorized users are rejected

🏠 Board-Scoped Rooms

Each board acts as a real-time room:

socket.join(boardId)


This ensures:

Events are isolated per board

No cross-board event leakage

Scalable multi-board handling

📡 Event-Driven Synchronization

After any mutation:

Database update

Activity logged

Socket event emitted

Example:

Task Created
↓
DB Insert
↓
Activity Logged
↓
Emit "task_created"
↓
All clients update state

Real-Time Events Emitted

task_created

task_deleted

task_moved

task_moved_across

task_assigned

task_unassigned

activity_created

This architecture ensures instant UI updates across all active clients.

📜 Activity Logging Service

A centralized service:

services/activity.service.ts


Automatically logs:

Task creation

Task movement

Task deletion

Assignment changes

Activity entries include:

Board ID

User ID

Action type

Metadata (JSON)

This supports:

Audit trail

Future analytics

Activity sidebar implementation

🌐 REST API Design

The backend follows RESTful conventions:

Authentication
POST /api/auth/register
POST /api/auth/login

Boards
GET /api/boards
POST /api/boards
GET /api/boards/:boardId/activities

Lists
GET /api/lists/:boardId
POST /api/lists

Tasks
POST /api/tasks
DELETE /api/tasks/:taskId
PATCH /api/tasks/:taskId/move
PATCH /api/tasks/:taskId/move-across
GET /api/tasks?search=&page=&limit=

Assignments
POST /api/tasks/:taskId/assign
DELETE /api/tasks/:taskId/unassign/:userId

📈 Scalability Considerations
1️⃣ Stateless Design

JWT-based authentication

No server sessions

Horizontal scaling ready

2️⃣ Socket Scaling

To scale in production:

Use Redis adapter for Socket.IO

Enable sticky sessions

Run multiple Node instances behind load balancer

3️⃣ Database Optimization

Indexed fields:

boardId

listId

userId

createdAt

Supports:

Fast filtering

Pagination

Search

4️⃣ Production Improvements (Future)

Rate limiting

Caching layer (Redis)

Queue-based activity logging

Cursor-based pagination

Read replicas

🏆 Architectural Strength Summary

The backend demonstrates:

Layered modular architecture

Strict ownership validation

Transaction-safe ordering logic

Event-driven real-time synchronization

Secure JWT-based authentication

Scalable database integration

Production-structured folder organization

This backend is structured for real-time collaborative SaaS-level applications.