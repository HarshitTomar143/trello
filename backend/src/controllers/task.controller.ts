import { Request, Response } from "express";
import prisma from "../config/prisma";
import { getIO } from "../socket/io";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, listId } = req.body;
    const userId = (req as any).userId;

    if (!title || !listId) {
      return res.status(400).json({ message: "Title and listId are required" });
    }

    
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        board: true,
      },
    });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    
    if (list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    
    const lastTask = await prisma.task.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastTask ? lastTask.position + 1 : 0;

    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        listId,
        position: newPosition,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTasksByList = async (req: Request<{ listId: string }>, res: Response) => {
  try {
    const userId = (req as any).userId;
    const listId = req.params.listId;

    if (!listId) {
      return res.status(400).json({ message: "List ID is required" });
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        board: true,
      },
    });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tasks = await prisma.task.findMany({
      where: { listId },
      orderBy: { position: "asc" },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const moveTaskWithinList = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const { newPosition } = req.body;
    const userId = (req as any).userId;

    if (newPosition === undefined) {
      return res.status(400).json({ message: "newPosition is required" });
    }

    // 1️⃣ Fetch task with list and board
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2️⃣ Ownership validation
    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const oldPosition = task.position;

    if (oldPosition === newPosition) {
      return res.status(200).json(task);
    }

    await prisma.$transaction(async (tx) => {
      if (newPosition > oldPosition) {
        // Moving down
        await tx.task.updateMany({
          where: {
            listId: task.listId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      } else {
        // Moving up
        await tx.task.updateMany({
          where: {
            listId: task.listId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }

      await tx.task.update({
        where: { id: taskId },
        data: {
          position: newPosition,
        },
      });
    });

    return res.status(200).json({ message: "Task moved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const moveTaskAcrossLists = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const { newListId, newPosition } = req.body;
    const userId = (req as any).userId;

    if (!newListId || newPosition === undefined) {
      return res.status(400).json({
        message: "newListId and newPosition are required",
      });
    }

    // 1️⃣ Fetch task with board ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const oldListId = task.listId;
    const oldPosition = task.position;

    await prisma.$transaction(async (tx) => {
      // 2️⃣ Fix old list (remove gap)
      await tx.task.updateMany({
        where: {
          listId: oldListId,
          position: {
            gt: oldPosition,
          },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // 3️⃣ Shift new list tasks
      await tx.task.updateMany({
        where: {
          listId: newListId,
          position: {
            gte: newPosition,
          },
        },
        data: {
          position: { increment: 1 },
        },
      });

      // 4️⃣ Update task
      await tx.task.update({
        where: { id: taskId },
        data: {
          listId: newListId,
          position: newPosition,
        },
      });
    });

    return res.status(200).json({ message: "Task moved across lists" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const userId = (req as any).userId;

    // 1️⃣ Fetch task with ownership check
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const listId = task.listId;
    const deletedPosition = task.position;

    await prisma.$transaction(async (tx) => {
      // 2️⃣ Delete the task
      await tx.task.delete({
        where: { id: taskId },
      });

      // 3️⃣ Fix positions (remove gap)
      await tx.task.updateMany({
        where: {
          listId,
          position: {
            gt: deletedPosition,
          },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};