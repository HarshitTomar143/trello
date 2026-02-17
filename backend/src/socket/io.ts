import {Server} from "socket.io";
let io: Server;

export const initSocket = (server:any) => {
    io= new Server(server, {
        cors: {origin: "*"},
    });

    io.on("connection", (socket)=> {
        console.log("User Connected:", socket.id);

        socket.on("join_board",(boardId: string)=> {
            socket.join(boardId);
            console.log(`Socket ${socket.id} joined board ${boardId}`);
        });

        socket.on("disconnect", ()=> {
            console.log("User Disconnected", socket.id);
        });
    });

    return io;
}; 

export const getIo = () => {
    if(!io) throw new Error("Socket.io not initialized");
    return io;
}