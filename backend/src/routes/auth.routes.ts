import {Router} from "express"
import {register, login} from "../../../backend/src/controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { getAllUsers } from "../../../backend/src/controllers/auth.controller"

const router = Router()

router.post("/register",register)
router.post("/login",login)
router.get("/users", authenticate, getAllUsers);

export default router