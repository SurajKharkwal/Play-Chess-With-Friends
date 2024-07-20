const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("hello", "World!");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("create-room", (roomInformation) => {
      const playerInformation = {};
      if (!playerInformation.whitePlayer) {
        socket.to(roomInformation.roomId).emit("whitePlayer");
        playerInformation.whitePlayer = socket.id;
      } else playerInformation.blackPlayer = socket.id;
      console.log(socket.id);
      socket.join(roomInformation.roomId).emit("Created Room");
      socket.to(roomInformation.roomId);
      console.log(roomInformation);
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
