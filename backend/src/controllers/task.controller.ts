import { Request, Response } from "express";
import prisma from "../config/prisma";
import { getIO } from "../socket/io";
import { logActivity } from "../services/activity.services";

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

    if (!task) {
    return res.status(404).json({ message: "Task not found" });
    }

    const activity = await logActivity(
    list.boardId,
    userId,
    "TASK_CREATED",
    { taskId: task.id }
    );

    const io = getIO();
    io.to(list.boardId).emit("activity_created", activity);
    io.to(list.boardId).emit("task_created", task);

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
      include: {
        assignments: {
        include: {
            user: true,
        },
        },
    },
    }

    

);


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

    const activity = await logActivity(
    task.list.boardId,
    userId,
    "TASK_MOVED",
    { taskId, newPosition }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const oldPosition = task.position;

    if (oldPosition === newPosition) {
      return res.status(200).json(task);
    }

    await prisma.$transaction(async (tx) => {
      if (newPosition > oldPosition) {
       
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

    const io = getIO();
    io.to(task.list.boardId).emit("activity_created", activity);
    io.to(task.list.boardId).emit("task_moved", {
    taskId,
    newPosition,
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

    const activity = await logActivity(
    task.list.boardId,
    userId,
    "TASK_MOVED_ACROSS",
    { taskId, newListId, newPosition }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const oldListId = task.listId;
    const oldPosition = task.position;

    await prisma.$transaction(async (tx) => {
    
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

      
      await tx.task.update({
        where: { id: taskId },
        data: {
          listId: newListId,
          position: newPosition,
        },
      });
    });

    const io = getIO();
    io.to(task.list.boardId).emit("activity_created", activity);
    io.to(task.list.boardId).emit("task_moved_across", {
    taskId,
    newListId,
    newPosition,
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

    const activity = await logActivity(
    task.list.boardId,
    userId,
    "TASK_DELETED",
    { taskId }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const listId = task.listId;
    const deletedPosition = task.position;

    await prisma.$transaction(async (tx) => {
      
      await tx.task.delete({
        where: { id: taskId },
      });

      
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

    const io = getIO();
    io.to(task.list.boardId).emit("activity_created", activity);
    io.to(task.list.boardId).emit("task_deleted", 
      taskId,
    );

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const assignUserToTask = async (
  req: Request<{ taskId: string }>,
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const currentUserId = (req as any).userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });

    if (!task) {
  return res.status(404).json({ message: "Task not found" });
}

    const activity = await logActivity(
    task.list.boardId,
    currentUserId,
    "TASK_ASSIGNED",
    { taskId, assignedUserId: userId }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== currentUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const assignment = await prisma.taskAssignment.create({
      data: {
        taskId,
        userId,
      },
    });

    
    const io = getIO();
    io.to(task.list.boardId).emit("activity_created", activity);
    io.to(task.list.boardId).emit("task_assigned", {
      taskId,
      userId,
    });

    return res.status(201).json(assignment);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "User already assigned" });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unassignUserFromTask = async (
  req: Request<{ taskId: string; userId: string }>,
  res: Response
) => {
  try {
    const { taskId, userId } = req.params;
    const currentUserId = (req as any).userId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });

    if (!task) {
  return res.status(404).json({ message: "Task not found" });
}

    const activity = await logActivity(
    task.list.boardId,
    currentUserId,
    "TASK_UNASSIGNED",
    { taskId, unassignedUserId: userId }
    );



    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.list.board.ownerId !== currentUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.taskAssignment.delete({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    const io = getIO();
    io.to(task.list.boardId).emit("activity_created", activity);
    io.to(task.list.boardId).emit("task_unassigned", {
      taskId,
      userId,
    });

    return res.status(200).json({ message: "User unassigned" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTasksPaginated = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).userId;

    const { search = "", page = "1", limit = "10", listId } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {
      ...(listId && { listId }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        include: {
          assignments: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          list: {
            include: {
              board: true,
            },
          },
        },
      }),
      prisma.task.count({
        where: whereCondition,
      }),
    ]);

    return res.status(200).json({
      data: tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

