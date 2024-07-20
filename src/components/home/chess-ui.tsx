"use client";
import { Button } from "@/components/ui/button";
import { MaxWidth } from "@/components/ui/max-width";
import { socket } from "@/socket";
import { Chess } from "chess.ts";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

export default function ChessboardHomeUI() {
  const [moves, setMoves] = useState<string[]>([]);
  const [game, setGame] = useState(
    new Chess(
      "r1bq1rk1/pp1n1pbp/3ppnp1/2p5/2P2B2/2N2N2/PPP1PPPP/R2QKB1R w KQ - 0 1"
    )
  );
  const [boardWidth, setBoardWidth] = useState<number>(300);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBoardWidth(window.innerWidth >= 500 ? 500 : 300);
    }
  }, []);

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    const newGame = new Chess(game.fen()); // Create a new instance to avoid direct mutation
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Assume promotion to queen for simplicity
    });

    if (move === null) return false; // Illegal move

    setGame(newGame);
    setMoves((prevMoves) => [...prevMoves, move.san]);

    return true; // Legal move
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
          id="BasicBoard"
        />
      </section>
    </MaxWidth>
  );
}
