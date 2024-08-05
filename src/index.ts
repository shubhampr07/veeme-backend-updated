import { Socket } from "socket.io";
import http from "http";
import dotenv from 'dotenv';
import express from "express"
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManager";
import cors from "cors";

const app = express();
dotenv.config();
const server = http.createServer(app);
const port = 8000;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });

  // New event for text chat
  socket.on("send_message", ({ roomId, message }) => {
    userManager.sendMessage(roomId, socket.id, message);
  });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});