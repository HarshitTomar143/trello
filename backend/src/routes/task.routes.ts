import { Router } from "express";
import { createTask } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getTasksByList } from "../controllers/task.controller";
import { moveTaskWithinList } from "../controllers/task.controller";
import { moveTaskAcrossLists } from "../controllers/task.controller";
import { deleteTask } from "../controllers/task.controller";
import {assignUserToTask, unassignUserFromTask,} from "../controllers/task.controller";

const router = Router();

router.post("/", authenticate, createTask);
router.get("/:listId", authenticate, getTasksByList);
router.patch("/:taskId/move", authenticate, moveTaskWithinList);
router.patch("/:taskId/move-across", authenticate, moveTaskAcrossLists);
router.delete("/:taskId", authenticate, deleteTask);
router.post("/:taskId/assign", authenticate, assignUserToTask);
router.delete("/:taskId/unassign/:userId", authenticate, unassignUserFromTask);

export default router;
