import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import authRoutes from "./routes/auth.routes"
import { authenticate } from "./middlewares/auth.middleware"
import boardRoutes from "../src/routes/board.routes"
import listRoutes from "./routes/list.routes"
import taskRoutes from "./routes/task.routes";
import { initSocket } from "./socket/io";


const app = express()
const server = http.createServer(app)

const io = initSocket(server);


app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/boards",boardRoutes)
app.use("/api/lists", listRoutes)
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running fine")
})

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ msg: "You are authenticated" })
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

server.listen(5000, () => {
  console.log("Server running on port 5000")
})
