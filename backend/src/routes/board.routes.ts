import {Router} from "express"
import {createBoard, getMyBoards} from "../controllers/board.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.post("/",authenticate, createBoard)
router.get("/",authenticate, getMyBoards)

export default router