import { socket } from "@/socket";
import { useEffect, useState } from "react";

type myRoleType = "white" | "black" | "spectator";

export default function useInitialGameData(roomId: string) {
  const [boardWidth, setBoardWidth] = useState(300);
  const [myRole, setMyRole] = useState<myRoleType>("spectator");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "black"
  );

  useEffect(() => {
    if (typeof window !== "undefined")
      setBoardWidth(window.innerWidth > 500 ? 500 : 300);

    socket.emit("join-room", roomId);

    socket.on("my-role", (role) => {
      setBoardOrientation(role === "black" ? "black" : "white");
      setMyRole(role);
    });
  }, [roomId]);
  return { boardWidth, myRole, boardOrientation };
}
