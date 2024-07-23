"use client";
import { MaxWidth } from "@/components/ui/max-width";
import useInitialGameData from "@/hooks/useInitialGameData";
import { socket } from "@/socket";
import { Chess } from "chess.ts";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

export default function PlayChess({
  searchParams,
}: {
  searchParams: { roomId: string };
}) {
  const [game, setGame] = useState(new Chess());
  const { roomId } = searchParams;
  const { boardWidth, boardOrientation, myRole } = useInitialGameData(roomId);

  socket.on("make-move", (newFen) => {
    setGame(new Chess(newFen));
  });

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    if (myRole === "spectator") return false;
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    socket.emit("broadcast-move", newGame.fen(), roomId);

    setGame(newGame);
    return true;
  };

  return (
    <MaxWidth>
      <section className="w-max">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: "5px",
            padding: "8px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#38bdf8",
          }}
          customLightSquareStyle={{
            backgroundColor: "#ecfeff",
          }}
          boardWidth={boardWidth}
          boardOrientation={boardOrientation}
          id="BasicBoard"
        />
      </section>
    </MaxWidth>
  );
}
