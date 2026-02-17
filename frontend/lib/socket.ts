import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;
