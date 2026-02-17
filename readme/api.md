📄 API Contract Design
📌 Overview

The backend follows a RESTful API design with consistent request structure, response formatting, proper HTTP status codes, and resource-based routing.

All protected routes require:

Authorization: Bearer <JWT_TOKEN>


The API is designed to be:

Stateless

Predictable

Resource-oriented

Secure

Scalable

🔐 Authentication APIs
Register

Endpoint

POST /api/auth/register


Request Body

{
  "name": "string",
  "email": "string",
  "password": "string"
}


Response

{
  "token": "JWT_TOKEN"
}

Login

Endpoint

POST /api/auth/login


Request Body

{
  "email": "string",
  "password": "string"
}


Response

{
  "token": "JWT_TOKEN"
}

📋 Boards API
Get All Boards
GET /api/boards


Response

[
  {
    "id": "string",
    "title": "string",
    "ownerId": "string",
    "createdAt": "timestamp"
  }
]

Create Board
POST /api/boards


Request Body

{
  "title": "string"
}


Response

{
  "id": "string",
  "title": "string",
  "ownerId": "string",
  "createdAt": "timestamp"
}

Get Board Activities
GET /api/boards/:boardId/activities


Response

[
  {
    "id": "string",
    "boardId": "string",
    "userId": "string",
    "action": "string",
    "metadata": {},
    "createdAt": "timestamp"
  }
]

🗂 Lists API
Get Lists by Board
GET /api/lists/:boardId


Response

[
  {
    "id": "string",
    "title": "string",
    "position": number,
    "boardId": "string"
  }
]

Create List
POST /api/lists


Request Body

{
  "title": "string",
  "boardId": "string"
}


Response

{
  "id": "string",
  "title": "string",
  "position": number,
  "boardId": "string"
}

✅ Tasks API
Get Tasks (Paginated & Searchable)
GET /api/tasks?search=&page=&limit=&listId=


Query Parameters

search (optional)

page (default: 1)

limit (default: 10)

listId (optional)

Response

{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "position": number,
      "listId": "string",
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}

Create Task
POST /api/tasks


Request Body

{
  "title": "string",
  "description": "string",
  "listId": "string"
}


Response

{
  "id": "string",
  "title": "string",
  "description": "string",
  "position": number,
  "listId": "string",
  "createdAt": "timestamp"
}

Delete Task
DELETE /api/tasks/:taskId


Response

{
  "message": "Task deleted successfully"
}

Move Task Within List
PATCH /api/tasks/:taskId/move


Request Body

{
  "newPosition": number
}


Response

{
  "message": "Task moved successfully"
}

Move Task Across Lists
PATCH /api/tasks/:taskId/move-across


Request Body

{
  "newListId": "string",
  "newPosition": number
}


Response

{
  "message": "Task moved across lists"
}

👥 Task Assignment API
Assign User to Task
POST /api/tasks/:taskId/assign


Request Body

{
  "userId": "string"
}


Response

{
  "id": "string",
  "taskId": "string",
  "userId": "string"
}

Unassign User from Task
DELETE /api/tasks/:taskId/unassign/:userId


Response

{
  "message": "User unassigned"
}

📡 Real-Time Events (Task-Level Only)

Socket events emitted:

task_created

task_deleted

task_moved

task_moved_across

task_assigned

task_unassigned

activity_created

🧠 Design Principles

Resource-oriented URLs

Proper HTTP methods (GET, POST, PATCH, DELETE)

Consistent JSON responses

Pagination support

Search capability

JWT-protected private routes

Clear separation between REST and real-time events

🏆 Summary

The API contract is:

RESTful

Predictable

Secure

Scalable

Real-time enabled for task operations

Structured for future extension