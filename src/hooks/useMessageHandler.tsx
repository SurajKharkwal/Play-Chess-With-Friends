import { socket } from "@/socket";
import { Move } from "chess.ts";
import { useEffect, useState } from "react";
import { Roles } from "./useInitialGameData";

export default function useMessageHandler(
  roomId: string,
  myRole: Roles,
  message: string
) {
  const [messageList, setMessageList] = useState<
    { from: Roles; message: string }[]
  >([]);

  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    const handleMove = (newFen: string, move: Move) => {
      setMoves((prevMove) => [...prevMove, move]);
      //   setGame(new Chess(newFen));
    };
    setMessageList((prevList) => [
      ...prevList,
      { from: myRole, message: message },
    ]);
    socket.on("make-move", handleMove);
    socket.emit("send-message", roomId, messageList[messageList.length]);
    socket.on("receive-message", (message) => {
      setMessageList((prevMessageList) => [...prevMessageList, message]);
    });

    // Cleanup the socket event listener on component unmount
    return () => {
      socket.off("make-move", handleMove);
    };
  }, [roomId, messageList, message, myRole]);

  return { messageList, moves };
}
