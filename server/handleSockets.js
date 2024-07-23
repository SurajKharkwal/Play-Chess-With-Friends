function joinRoom(roomId, Rooms, socketId) {
  if (!Rooms[roomId]) {
    Rooms[roomId] = {
      players: {
        white: socketId,
        black: "",
      },
      spectator: [],
    };
    return "white";
  }
  if (Rooms[roomId]) {
    const { white, black } = Rooms[roomId].players;
    if (!black) {
      Rooms[roomId].players.black = socketId;
      return "black";
    }
    if (white && black) {
      Rooms[roomId].spectator.push(socketId);
      return "spectator";
    }
  }
}

module.exports = {
  joinRoom,
};
