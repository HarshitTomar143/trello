📊 Database Schema Diagram Explanation
📌 Overview

The database is designed using a relational model with PostgreSQL and Prisma ORM.
It follows a hierarchical structure:

User → Board → List → Task


Additionally, it supports:

Many-to-many task assignments

Activity logging per board

🧱 Core Entities
1️⃣ User

Represents an authenticated platform user.

Fields:

id (Primary Key)

name

email (Unique)

password

createdAt

Relationships:

One User → Many Boards

One User → Many TaskAssignments

One User → Many Activities

2️⃣ Board

Represents a workspace owned by a user.

Fields:

id (Primary Key)

title

ownerId (Foreign Key → User.id)

createdAt

Relationships:

One Board → Many Lists

One Board → Many Activities

Owned by one User

3️⃣ List

Represents a column inside a board.

Fields:

id (Primary Key)

title

position (Used for ordering)

boardId (Foreign Key → Board.id)

Relationships:

One List → Many Tasks

Belongs to one Board

4️⃣ Task

Represents an individual task card.

Fields:

id (Primary Key)

title

description

position (Used for ordering inside list)

listId (Foreign Key → List.id)

createdAt

Relationships:

One Task → Many TaskAssignments

Belongs to one List

5️⃣ TaskAssignment (Many-to-Many)

Enables multiple users to be assigned to a task.

Fields:

id (Primary Key)

taskId (Foreign Key → Task.id)

userId (Foreign Key → User.id)

Constraint:

UNIQUE(taskId, userId) prevents duplicate assignments.

Relationships:

Many Users ↔ Many Tasks

6️⃣ Activity

Tracks actions performed within a board.

Fields:

id (Primary Key)

boardId (Foreign Key → Board.id)

userId (Foreign Key → User.id)

action (String identifier)

metadata (JSON)

createdAt

Purpose:

Audit trail

Real-time activity feed

Historical tracking

🔗 Relationship Summary

One User owns many Boards.

One Board contains many Lists.

One List contains many Tasks.

Tasks can have multiple assigned Users.

Boards maintain an Activity log of actions.

This schema ensures:

Clear hierarchical structure

Ordered task positioning

Multi-user task collaboration

Activity tracking

Strict relational integrity