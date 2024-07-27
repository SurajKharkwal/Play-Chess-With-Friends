const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { joinRoom } = require("./server/handleSockets");

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
    socket.on("join-room", (roomId, isPrivate) => {
      const res = joinRoom(roomId, Rooms, socket.id, isPrivate === "true");

      socket.join(res.roomId);

      io.to(res.roomId).emit("players-joined", res.player);
      io.to(socket.id).emit("my-role", res.player, res.roomId);
    });

    socket.on("make-move", (fenString, roomId, move) => {
      io.to(roomId).emit("cast-move", fenString, move);
    });

    socket.on("send-message", (roomId, messageObj) => {
      const target = messageObj.to === "white"
        ? Rooms[roomId].players.white
        : messageObj.to === "black"
        ? Rooms[roomId].players.black
        : roomId;

      socket.to(target).emit("receive-message", messageObj);
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
