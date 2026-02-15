import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import authRoutes from "./routes/auth.routes"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
  res.send("API is running fine")
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
