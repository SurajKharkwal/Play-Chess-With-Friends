"use client";
import useInitialGameData, { Roles } from "@/hooks/useInitialGameData";
import { socket } from "@/socket";
import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import ChessMovesDetails from "@/components/play-chess/ChessMovesTable";
import ChatBox from "@/components/play-chess/ChatBox";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import * as Dialog from "@radix-ui/react-dialog";

export default function PlayChess({
  searchParams,
}: {
  searchParams: { tempId: string; isPrivate: boolean };
}) {
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const { tempId, isPrivate } = searchParams;
  const { roomId, boardWidth, boardOrientation, myRole, playersJoined } =
    useInitialGameData(tempId, isPrivate);

  useEffect(() => {
    socket.on("cast-move", (fenString) => {
      const newGame = new Chess(fenString);
      setGame(newGame);
      checkGameOver(newGame);
    });

    return () => {
      socket.off("cast-move");
    };
  }, []);

  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  const checkGameOver = (game: Chess) => {
    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isCheckmate()) {
        setWinner(game.turn() === "w" ? "Black" : "White");
        showToast("Game Over", `${winner} won the match`);
      } else {
        setWinner("Draw");

        showToast("Game Over", "Draw");
      }
    }
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    if (myRole === "spectator") {
      showToast("Spectator Action", "You cannot make moves as a spectator.");
      return false;
    }
    if (!playersJoined.black) {
      showToast("Waiting for Opponent", "Black player hasn't joined yet.");
      return false;
    }
    if (!myRole.startsWith(game.turn())) {
      showToast("Not Your Turn", "Please wait for your opponent to move.");
      return false;
    }
    if (game.inCheck()) {
      showToast("Check!", "You are in check.");
      return false;
    }
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) {
      showToast("Invalid Move", "The move you made is not valid.");
      return false;
    }
    if (newGame.inCheck()) {
      showToast("Check!", "You have put your opponent in check.");
    }
    socket.emit("make-move", newGame.fen(), roomId, move);
    setGame(newGame);
    checkGameOver(newGame);
    return true;
  };

  return (
    <main className="flex flex-wrap justify-around max-w-7xl w-full mx-auto p-4">
      <section className="w-full md:w-auto mb-8 md:mb-0">
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
      <section className="flex flex-col-reverse md:flex-col md:max-w-sm w-full gap-8">
        <ChessMovesDetails />
        <ChatBox myRole={myRole} roomId={roomId} />
      </section>
    </main>
  );
}
