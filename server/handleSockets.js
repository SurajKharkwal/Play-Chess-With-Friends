const crypto = require("crypto");

function joinRoom(roomId, Rooms, socketId, isPrivate) {
  if (isPrivate) {
    // Handling private rooms
    if (!Rooms[roomId]) {
      Rooms[roomId] = createNewRoom(socketId, isPrivate);
      return { player: "white", roomId };
    }

    const { white, black } = Rooms[roomId].players;

    if (!black) {
      Rooms[roomId].players.black = socketId;
      return { player: "black", roomId };
    }

    Rooms[roomId].spectators.push(socketId);
    return { player: "spectator", roomId };
  } else {
    // Handling public rooms
    const availableRoom = Object.keys(Rooms).find(
      (key) => !Rooms[key].players.black && !Rooms[key].isPrivate
    );

    if (availableRoom) {
      Rooms[availableRoom].players.black = socketId;
      return { player: "black", roomId: availableRoom };
    }

    // If all rooms are full, create a new room
    const newRoomId = crypto.randomUUID();
    Rooms[newRoomId] = createNewRoom(socketId, isPrivate);
    return { player: "white", roomId: newRoomId };
  }
}

function createNewRoom(socketId, isPrivate) {
  return {
    players: {
      white: socketId,
      black: "",
    },
    spectators: [],
    isPrivate: isPrivate,
  };
}

module.exports = { joinRoom };
