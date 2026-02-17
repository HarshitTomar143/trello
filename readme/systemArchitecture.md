# 🏗 System Architecture Overview

## 📌 Overview

The platform follows a full-stack, event-driven architecture using:

- Next.js (Frontend)
- Node.js + Express (Backend)
- PostgreSQL (Prisma ORM)
- Socket.IO (Real-Time)
- JWT Authentication

It supports secure multi-user collaboration, transaction-safe ordering, and real-time synchronization.

---

## 🌐 High-Level Flow

Client (Next.js)  
↓  
REST API (Express)  
↓  
Prisma ORM  
↓  
PostgreSQL  
↓  
Socket.IO Emit  
↓  
Connected Clients (Board Room)

REST handles mutations.  
Socket.IO synchronizes changes in real time.

---

## 🖥 Frontend Layer

Responsibilities:

- UI rendering
- Drag-and-drop
- Optimistic updates
- API communication
- Real-time event listening

Characteristics:

- Board-scoped state
- Event-driven updates
- JWT-protected routes

---

## ⚙ Backend Layer

Responsibilities:

- Authentication & authorization
- Ownership validation
- Transaction-safe mutations
- Activity logging
- Real-time event emission

Architecture:

Routes → Controllers → Services → Prisma → Database

Security:

- JWT-based authentication
- Middleware-protected routes
- Secure socket handshake
- Board-level ownership validation

---

## 🗄 Database Layer

Relational model:

User → Board → List → Task  
                     ↓  
             TaskAssignment  
                     ↓  
                 Activity  

Key features:

- Indexed foreign keys
- Position-based ordering
- Transaction-safe updates
- JSON metadata support

---

## 📡 Real-Time Layer

- JWT-verified socket connection
- Board-scoped rooms (`socket.join(boardId)`)
- Event-driven synchronization

Real-time implemented for:

- Task creation
- Task deletion
- Task movement
- Task assignment
- Activity updates

Boards and lists use REST updates.

---

## 🔄 Example Flow (Drag & Drop)

1. UI performs optimistic update  
2. PATCH request sent  
3. Backend validates ownership  
4. DB updated inside transaction  
5. `task_moved` emitted  
6. Other clients update  

Ensures consistency and multi-user sync.

---

## 📈 Scalability Model

Supports scaling through:

- Stateless JWT authentication
- Modular backend structure
- Indexed relational schema
- Board-scoped socket rooms
- Redis adapter readiness
- Load balancer compatibility

---

## 🏆 Summary

The architecture demonstrates:

- Full-stack integration
- Real-time collaboration
- Secure multi-user isolation
- Transactional consistency
- Modular backend structure
- Scalable real-time design

Suitable for real-time collaborative SaaS systems.
