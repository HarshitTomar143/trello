import prisma from "../config/prisma";

export const logActivity = async (
  boardId: string,
  userId: string,
  action: string,
  metadata?: any
) => {
  return prisma.activity.create({
    data: {
      boardId,
      userId,
      action,
      metadata,
    },
  });
};
