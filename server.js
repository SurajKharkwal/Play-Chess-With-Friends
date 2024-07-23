const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { joinRoom, isMyTurn } = require("./server/handleSockets");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const Rooms = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      const res = joinRoom(roomId, Rooms, socket.id);
      socket.join(roomId);
      io.to(socket.id).emit("my-role", res);
    });
    socket.on("broadcast-move", (fenString, roomId) => {
      socket.to(roomId).emit("make-move", fenString);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
