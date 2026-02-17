📡 Real-Time Sync Strategy
📌 Overview

The application uses Socket.IO to provide real-time synchronization across multiple clients.

Currently, real-time communication is implemented only for task-related operations.
Boards and lists use standard REST-based updates.

🏗 Architecture Model

The real-time system follows a board-scoped room strategy:

Client connects with JWT
↓
Socket authentication
↓
Client joins board room
↓
Server emits task events to that room
↓
All connected clients update UI


Each board acts as an isolated real-time channel.

🔐 Secure Socket Authentication

During connection:

Client sends JWT token in handshake

Server verifies token

userId is attached to the socket instance

Only authenticated users can connect and join board rooms.

🏠 Board-Scoped Rooms

When a board page loads:

socket.emit("join_board", boardId)


The server validates ownership and executes:

socket.join(boardId)


This ensures:

Events are isolated per board

No cross-board data leakage

Scalable room-based broadcasting

🔄 Task-Level Real-Time Events

Real-time synchronization is implemented only for tasks.

The following task operations emit socket events:

task_created

task_deleted

task_moved

task_moved_across

task_assigned

task_unassigned

activity_created

Boards and lists currently rely on REST updates only.

🔁 Event Flow Example
Task Creation
Client sends POST /api/tasks
↓
Server creates task in database
↓
Activity is logged
↓
Server emits "task_created" to board room
↓
All clients update task state

Task Reordering (Drag & Drop)
Client performs optimistic UI update
↓
Client sends PATCH request
↓
Server updates task position (transaction-safe)
↓
Server emits "task_moved"
↓
Other clients update state


The active client uses optimistic updates for smoother UX, while other clients synchronize via socket events.

⚡ Why Real-Time Is Limited to Tasks

Real-time synchronization is implemented for tasks because:

Tasks are the most frequently mutated entity

Drag-and-drop requires instant multi-client consistency

Task assignments impact collaboration directly

Boards and lists are less frequently modified and currently use REST-based refresh.

This keeps the system efficient and avoids unnecessary socket traffic.

🧠 Design Characteristics

Event-driven architecture

Board-scoped room isolation

JWT-secured socket handshake

Optimistic UI on active client

Server-authoritative database updates

No polling used

📈 Scalability Considerations

To scale real-time infrastructure:

Use Redis adapter for multi-instance socket scaling

Deploy behind load balancer with sticky sessions

Separate REST and WebSocket services if needed

🏆 Summary

The real-time system:

Uses Socket.IO with JWT authentication

Isolates communication per board

Synchronizes task-level changes instantly

Maintains transactional database consistency

Avoids overusing real-time for low-frequency entities

This design ensures efficient, secure, and scalable real-time collaboration.