import { socket } from "@/socket";
import { useEffect, useState, useRef } from "react";

export type Roles = "white" | "black" | "spectator";

export default function useInitialGameData(tempId: string, isPrivate: boolean) {
  const [boardWidth, setBoardWidth] = useState(300);
  const [myRole, setMyRole] = useState<Roles>("spectator");
  const [roomId, setRoomId] = useState(tempId);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("black");
  const roomIdRef = useRef(tempId); // Use ref to keep track of roomId

  const [playersJoined, setPlayersJoined] = useState({
    white: false,
    black: false,
    spectator: 0,
  });

  useEffect(() => {
    const updateBoardWidth = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 425) setBoardWidth(300);
        else if (window.innerWidth < 728) setBoardWidth(400);
        else if (window.innerWidth < 1024) setBoardWidth(600);
        else setBoardWidth(800);
      }
    };

    updateBoardWidth();
    window.addEventListener("resize", updateBoardWidth);

    socket.emit("join-room", roomIdRef.current, isPrivate);

    socket.on("players-joined", (player) => {
      setPlayersJoined((prev) => {
        const updated = { ...prev };
        if (player === "white") updated.white = true;
        if (player === "black") updated.black = true;
        if (player === "spectator") updated.spectator += 1;
        return updated;
      });
    });

    socket.on("my-role", (role, newRoomId) => {
      if (!isPrivate && role === "black") {
        setRoomId(newRoomId); // Update roomId state
        roomIdRef.current = newRoomId; // Update ref
      }
      setBoardOrientation(role === "black" ? "black" : "white");
      setMyRole(role);
    });

    return () => {
      window.removeEventListener("resize", updateBoardWidth);
      socket.off("players-joined");
      socket.off("my-role");
    };
  }, [isPrivate, tempId]); // Include tempId in the dependency array

  return { roomId, boardWidth, myRole, boardOrientation, playersJoined };
}
