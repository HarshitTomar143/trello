🖥 Frontend Architecture
📌 Overview

The frontend of the Real-Time Task Collaboration Platform is built using Next.js (App Router) with TypeScript, styled using TailwindCSS, and enhanced with Socket.IO Client for real-time synchronization and dnd-kit for drag-and-drop functionality.

The architecture follows a component-driven, modular, and scalable design, ensuring separation of concerns between UI, state management, API communication, and real-time synchronization.

🏗 Architectural Design Principles

The frontend is designed around the following core principles:

Component Modularity

Separation of Concerns

Optimistic UI Updates

Event-Driven Real-Time Synchronization

Scalable Folder Structure

API Abstraction Layer

Socket Abstraction Layer

🧭 Routing Architecture (Next.js App Router)

The application uses Next.js App Router for structured and scalable navigation.

Route Structure
/login
/register
/boards
/boards/[boardId]

Key Pages

Authentication Pages

Login

Register

Board Listing Page

Displays all boards owned by the user

Dynamic Board Page (/boards/[boardId])

Displays lists and tasks

Handles drag-and-drop

Connects to real-time socket room

Manages board-scoped state

This structure allows isolated rendering per board and supports scalable multi-board workflows.

📦 Component Architecture

The frontend follows a modular component structure:

Core Components

AddTaskForm

AddListForm

SortableTask

Board page container

Component Responsibilities
Component	Responsibility
BoardPage	Orchestrates board state, sockets, and drag logic
AddTaskForm	Handles task creation
AddListForm	Handles list creation
SortableTask	Implements draggable task UI

Each component is designed to be:

Reusable

Isolated

Single-responsibility focused

🔌 API Communication Layer
Centralized Axios Instance (lib/api.ts)

All REST API calls are routed through a single Axios instance.

Features

Base URL configured via environment variables

JWT automatically attached using request interceptor

Centralized error handling capability

Consistent API response handling

Benefits

Prevents duplication of configuration

Simplifies token management

Improves maintainability

Enables easy API refactoring

⚡ Real-Time Synchronization Layer
Socket Abstraction (lib/socket.ts)

The frontend uses Socket.IO client for real-time updates.

Connection Strategy

JWT token passed during handshake

Server validates authentication

User joins board-specific room

socket.emit("join_board", boardId)

Event Handling

The board listens for events such as:

task_created

task_deleted

task_moved

task_moved_across

task_assigned

activity_created

This enables real-time multi-tab and multi-user synchronization.

🧠 State Management Strategy

State is managed using React’s useState and useEffect.

Primary State

lists

tasks

Key Design Choices

Board-scoped state: Each board page manages its own state.

Optimistic updates for drag-and-drop and deletion.

Socket-driven synchronization for external changes.

No global state library required due to scoped architecture.

🎯 Optimistic UI Strategy

For operations like:

Drag-and-drop reordering

Task deletion

The frontend updates UI immediately before server confirmation.

Why?

Improves perceived performance

Reduces UI latency

Creates smooth drag experience

Other clients are synchronized via socket events.

🧲 Drag and Drop Architecture

Implemented using dnd-kit.

Key Components

DndContext

SortableContext

useSortable

Design Approach

Tasks sorted by position

Optimistic reordering in UI

Backend transaction updates position

Socket event synchronizes other clients

This ensures:

No duplicate positions

No ordering gaps

Consistent cross-client state

🧱 Folder Structure (Frontend)
frontend/
│
├── app/
│   ├── login/
│   ├── register/
│   ├── boards/
│   │   └── [boardId]/
│
├── components/
│   ├── AddTaskForm.tsx
│   ├── AddListForm.tsx
│   ├── SortableTask.tsx
│
├── lib/
│   ├── api.ts
│   ├── socket.ts
│
├── types/
│
├── .env.local


This structure promotes scalability and clean separation between:

UI

Networking

Real-time logic

Types

🔐 Security Considerations

JWT stored in localStorage

Token attached to:

Axios requests

Socket handshake

Unauthorized users cannot:

Access protected routes

Join board socket rooms

📈 Scalability Considerations

The frontend architecture supports scaling because:

Board pages are isolated

State is board-scoped

API and socket layers are abstracted

Components are reusable

Real-time events are event-driven, not polling-based

Future scalability improvements may include:

Global state management (if app grows)

Lazy loading tasks

Virtualized task lists

Caching strategies

🚀 Architectural Strength Summary

The frontend architecture demonstrates:

Clean separation of concerns

Real-time synchronization

Optimistic UI strategy

Modular component design

Scalable routing structure

Secure API integration

This architecture is production-ready and suitable for real-time collaborative applications.