import {Response, Request} from "express"
import prisma from "../config/prisma"


interface AuthRequest extends Request {
    userId?: string
}

export const createBoard = async (req:AuthRequest, res: Response) => {
    try {
        const{title} = req.body

        if(!title){
            return res.status(400).json({message: "Title is required"})
        }

        const board = await prisma.board.create({
            data:{
                title,
                ownerId: req.userId as string
            }
        })

        return res.status(201).json(board)
    } catch(error){
        console.log(error)
        return res.status(500).json({msg: "Internal Server Error"})
    }
}

export const getMyBoards = async (req: AuthRequest, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      where: {
        ownerId: req.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return res.json(boards)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}