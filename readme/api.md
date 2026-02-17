# 📄 API Contract Design

## 📌 Overview

The backend follows a RESTful, resource-oriented API design.

All protected routes require:

Authorization: Bearer <JWT_TOKEN>

The API is:

- Stateless (JWT-based)
- Predictable
- Secure
- Pagination-ready
- Real-time integrated (task-level)

---

## 🔐 Authentication

### Register
POST `/api/auth/register`

Request:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
Response:

{ "token": "JWT_TOKEN" }
Login
POST /api/auth/login

Response:

{ "token": "JWT_TOKEN" }
📋 Boards
GET /api/boards

POST /api/boards

GET /api/boards/:boardId/activities

Returns board metadata and activity logs.

🗂 Lists
GET /api/lists/:boardId

POST /api/lists

Each list includes:

id

title

position

boardId

✅ Tasks
Get Tasks (Paginated)
GET /api/tasks?search=&page=&limit=&listId=

Response:

{
  "data": [...],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
Create Task
POST /api/tasks

Delete Task
DELETE /api/tasks/:taskId

Move Task (Same List)
PATCH /api/tasks/:taskId/move

Move Task (Across Lists)
PATCH /api/tasks/:taskId/move-across

All move operations are transaction-safe.

👥 Task Assignment
POST /api/tasks/:taskId/assign

DELETE /api/tasks/:taskId/unassign/:userId

Supports multi-user collaboration.

📡 Real-Time Events
Socket events emitted:

task_created

task_deleted

task_moved

task_moved_across

task_assigned

task_unassigned

activity_created

Real-time updates are implemented at the task level.

🧠 Design Principles
Resource-based routing

Proper HTTP methods

Consistent JSON responses

Pagination & search support

JWT-protected private routes

Clear separation of REST & real-time layers

🚀 Summary
The API contract is:

RESTful

Secure

Transaction-safe

Real-time enabled

Scalable for future extension