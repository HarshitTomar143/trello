import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

     
      (socket as any).userId = decoded.userId;

      next();
    } catch (err) {
      next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Authenticated user connected:", socket.id);

    socket.on("join_board", async (boardId: string) => {
    const userId = (socket as any).userId;

    const board = await prisma.board.findUnique({
        where: { id: boardId },
    });

    if (!board) {
        console.log("Board not found");
        return;
    }

    if (board.ownerId !== userId) {
        console.log("Unauthorized board access attempt");
        return;
    }

    socket.join(boardId);
    console.log(`User ${userId} joined board ${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
