import { Request, Response } from "express"
import prisma from "../config/prisma"

interface AuthRequest extends Request {
  userId?: string
}

export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const { title, boardId } = req.body

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and boardId required" })
    }

    
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    })

    console.log("req.userId:", req.userId)
    console.log("board:", board)

    if (!board || board.ownerId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

  
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" }
    })

    const newPosition = lastList ? lastList.position + 1 : 0

    const list = await prisma.list.create({
      data: {
        title,
        boardId,
        position: newPosition
      }
    })

    

    return res.status(201).json(list)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getBoardLists = async (req: AuthRequest, res: Response) => {
  try {
    const  boardId  = req.params.boardId as string

    const board = await prisma.board.findUnique({
      where: { id: boardId }
    })

    if (!board || board.ownerId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const lists = await prisma.list.findMany({
      where: { boardId },
      orderBy: { position: "asc" }
    })

    return res.json(lists)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
