const { io } = require("socket.io-client");

const socket = io("http://localhost:5000",{
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMzM0NTdkMC00ZWQzLTQ5M2ItYjA3Yy05ZGM2OGU4YjJjMzIiLCJpYXQiOjE3NzExNjgwMjksImV4cCI6MTc3MTc3MjgyOX0.eOmKzFJKxxAaI_-Qh334nAiVhadviw-oolzkKnfJH7I"
    }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  
  socket.emit("join_board", "fbbb1df5-9a26-4b1f-b413-fe1c1bec2a0f");
});

socket.on("task_created", (data) => {
  console.log("Task created:", data);
});

socket.on("task_moved", (data) => {
  console.log("Task moved:", data);
});

socket.on("task_deleted", (data) =>{
  console.log("Task deleted:", data)
});
