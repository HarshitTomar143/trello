# 📊 Database Schema

## 📌 Overview

The database is built using PostgreSQL with Prisma ORM.

It follows a hierarchical relational structure:

User → Board → List → Task

Additionally supports:

- Many-to-many task assignments
- Board-level activity logging
- Ordered positioning of lists and tasks

---

## 🧱 Core Entities

### 👤 User
- id (PK)
- name
- email (unique)
- password
- createdAt

Relationships:
- One user → many boards
- One user → many task assignments
- One user → many activities

---

### 📋 Board
- id (PK)
- title
- ownerId (FK → User.id)
- createdAt

Relationships:
- One board → many lists
- One board → many activities

---

### 🗂 List
- id (PK)
- title
- position (ordering)
- boardId (FK → Board.id)

Relationships:
- One list → many tasks

---

### ✅ Task
- id (PK)
- title
- description
- position (ordering inside list)
- listId (FK → List.id)
- createdAt

Relationships:
- One task → many assignments

---

### 👥 TaskAssignment (Many-to-Many)
- id (PK)
- taskId (FK → Task.id)
- userId (FK → User.id)

Constraint:
- UNIQUE(taskId, userId)

Enables multiple users per task.

---

### 📡 Activity
- id (PK)
- boardId (FK → Board.id)
- userId (FK → User.id)
- action (string)
- metadata (JSON)
- createdAt

Used for audit trail and real-time activity feed.

---

## 🔗 Relationship Summary

- One User owns many Boards  
- One Board contains many Lists  
- One List contains many Tasks  
- Tasks can have multiple assigned Users  
- Boards maintain an Activity log  

---

## 🚀 Schema Strength

The schema ensures:

- Clear hierarchical structure  
- Ordered task positioning  
- Multi-user collaboration  
- Activity tracking  
- Strong relational integrity  
