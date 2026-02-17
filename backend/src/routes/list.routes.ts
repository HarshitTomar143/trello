import { Router } from "express"
import { createList, getBoardLists } from "../controllers/list.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.post("/", authenticate, createList)
router.get("/:boardId", authenticate, getBoardLists)

export default router
