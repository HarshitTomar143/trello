# 🧠 Real-Time Task Collaboration Platform

A full-stack, real-time collaborative task management system inspired by Trello.

---

## 🖥 Frontend Architecture

<p align="center">
  <img src="./assets/frontend.png" alt="Frontend Architecture" width="800"/>
</p>

Routing, state management, drag-and-drop logic, and real-time integration built using Next.js App Router.

---

## 🧠 Backend Architecture

<p align="center">
  <img src="./assets/backend.png" alt="Backend Architecture" width="800"/>
</p>

Layered architecture with controllers, services, Prisma ORM, JWT authentication, and Socket.IO integration.

---

## 📊 Database Schema

<p align="center">
  <img src="./assets/db_schema.png" alt="Database Schema" width="800"/>
</p>

Relational structure representing Board → List → Task hierarchy with ownership and constraints.

---

## 🚀 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Axios
- Socket.IO Client
- dnd-kit

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Socket.IO
- JWT
- bcrypt

- ---

## 📚 Detailed Documentation

This project is divided into focused architectural documents for clarity and scalability.

---

### 🖥 Frontend Architecture

Explains the Next.js App Router structure, component hierarchy, drag-and-drop implementation using dnd-kit, state management strategy, optimistic UI updates, and real-time integration via Socket.IO client.

👉 [View Frontend Architecture](./readme/frontend.md)

---

### 🧠 Backend Architecture

Describes the layered backend design including controllers, services, middleware, Prisma integration, JWT authentication flow, ownership validation, and WebSocket authentication strategy.

👉 [View Backend Architecture](./readme/backend.md)

---

### 🏗 System Architecture

Provides a high-level overview of how frontend, backend, database, and real-time layers interact. Covers request flow, event flow, and overall system design principles.

👉 [View System Architecture](./readme/systemArchitecture.md)

---

### 📊 Database Schema

Breakdown of relational structure including Board → List → Task hierarchy, foreign key relationships, indexing strategy, cascading rules, and data integrity constraints.

👉 [View Database Schema](./readme/dbSchema.md)

---

### 📡 Real-Time Synchronization Strategy

Explains board-scoped socket rooms, event emission model, transactional updates, real-time task synchronization, and scalability considerations for multi-user environments.

👉 [View Real-Time Strategy](./readme/realTime.md)

---

### 📄 API Contract

Complete REST API documentation including endpoints, request/response structure, authentication requirements, validation rules, and error handling format.

👉 [View API Contract](./readme/api.md)

---

### 📈 Scalability Strategy

Covers horizontal scaling considerations, Redis adapter for multi-instance Socket.IO, database indexing strategies, pagination design, and production-readiness planning.

👉 [View Scalability Guide](./readme/scalability.md)

---

### 🚀 Deployment Guide

Includes local development setup, environment configuration, Prisma migrations, production build process, and deployment architecture recommendations.

👉 [View Deployment Guide](./readme/deployment.md)


- ---

## 📚 Detailed Documentation

This project is divided into focused architectural documents for clarity and scalability.

---

### 🖥 Frontend Architecture

Explains the Next.js App Router structure, component hierarchy, drag-and-drop implementation using dnd-kit, state management strategy, optimistic UI updates, and real-time integration via Socket.IO client.

👉 [View Frontend Architecture](./readme/frontend.md)

---

### 🧠 Backend Architecture

Describes the layered backend design including controllers, services, middleware, Prisma integration, JWT authentication flow, ownership validation, and WebSocket authentication strategy.

👉 [View Backend Architecture](./readme/backend.md)

---

### 🏗 System Architecture

Provides a high-level overview of how frontend, backend, database, and real-time layers interact. Covers request flow, event flow, and overall system design principles.

👉 [View System Architecture](./readme/systemArchitecture.md)

---

### 📊 Database Schema

Breakdown of relational structure including Board → List → Task hierarchy, foreign key relationships, indexing strategy, cascading rules, and data integrity constraints.

👉 [View Database Schema](./readme/dbSchema.md)

---

### 📡 Real-Time Synchronization Strategy

Explains board-scoped socket rooms, event emission model, transactional updates, real-time task synchronization, and scalability considerations for multi-user environments.

👉 [View Real-Time Strategy](./readme/realTime.md)

---

### 📄 API Contract

Complete REST API documentation including endpoints, request/response structure, authentication requirements, validation rules, and error handling format.

👉 [View API Contract](./readme/api.md)

---

### 📈 Scalability Strategy

Covers horizontal scaling considerations, Redis adapter for multi-instance Socket.IO, database indexing strategies, pagination design, and production-readiness planning.

👉 [View Scalability Guide](./readme/scalability.md)

---

### 🚀 Deployment Guide

Includes local development setup, environment configuration, Prisma migrations, production build process, and deployment architecture recommendations.

👉 [View Deployment Guide](./readme/deployment.md)

# 🧪 Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>

cd backend
npm install

Create .env inside backend/:
DATABASE_URL=postgresql://username:password@localhost:5432/your_db
JWT_SECRET=your_secret
PORT=5000


Run migrations:
npx prisma migrate dev

Start backend:
npm run dev

Frontend Setup
cd ../frontend
npm install


Create .env.local inside frontend/:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

Start frontend:
npm run dev

---

# 🔎 API Testing with Postman

All REST APIs were tested using **Postman** to validate:

- User registration and login
- JWT-based authentication
- Protected route access
- Board, list, and task CRUD operations
- Task reordering and assignment endpoints
- Proper status codes and JSON responses

Authentication was verified by attaching the JWT token in:

Authorization → Bearer Token

This ensured all protected routes were securely validated before execution.

---

## 📸 Postman Testing Screenshot

<p align="center">
  <img src="./assets/postman.png" alt="Postman API Testing Screenshot" width="800"/>
</p>