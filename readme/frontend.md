# 🖥 Frontend Architecture

## 📌 Overview

The frontend is built using:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Socket.IO Client
- dnd-kit (Drag & Drop)

It follows a modular and scalable structure with clear separation between UI, API calls, and real-time logic.

---

## 🧭 Routing Structure

/login
/register
/boards
/boards/[boardId]


- `/boards` → Displays user boards  
- `/boards/[boardId]` → Handles lists, tasks, drag-and-drop, and real-time updates  

Each board page manages its own state and socket room.

---

## 🧩 Component Design

Main components:

- `BoardPage` – Manages state, sockets, drag logic  
- `AddTaskForm` – Creates tasks  
- `AddListForm` – Creates lists  
- `SortableTask` – Draggable task UI  

All components follow single-responsibility and reusability principles.

---

## 🔌 API Layer

All API calls use a centralized Axios instance (`lib/api.ts`).

- JWT attached automatically via interceptor  
- Base URL via environment variables  
- Centralized configuration  

---

## ⚡ Real-Time Integration

Socket abstraction in `lib/socket.ts`.

- JWT sent during handshake  
- User joins board-specific room  
- Listens for task events (create, delete, move, assign)

Ensures multi-user real-time synchronization.

---

## 🎯 State & UI Strategy

- Board-scoped state using `useState`  
- Optimistic updates for drag-and-drop  
- Server maintains final consistency  
- Other clients sync via socket events  

No global state library required.

---

## 🧱 Folder Structure

frontend/
├── app/
├── components/
├── lib/
├── types/


Clean separation between UI, networking, and real-time logic.

---

## 🚀 Summary

The frontend architecture demonstrates:

- Modular component design  
- Optimistic UI updates  
- Real-time synchronization  
- Secure API integration  
- Scalable routing structure  
This version is:

✔ Clean
