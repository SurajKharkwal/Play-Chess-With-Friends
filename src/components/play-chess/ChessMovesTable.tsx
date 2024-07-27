import { Move } from "chess.ts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function ChessMovesDetails() {
  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    socket.on("cast-move", (fenString, moves) => {
      setMoves((prevMoves) => [...prevMoves, moves]);
    });
  }, []);

  return (
    <Accordion type="single" collapsible className="w-full h-full">
      <AccordionItem value="item-r">
        <AccordionTrigger>Moves</AccordionTrigger>
        <AccordionContent>
          <section className="h-[247px] overflow-auto flex justify-center w-full  ">
            <DetailsTable moves={moves} />
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function DetailsTable({ moves }: { moves: Move[] }) {
  return (
    <Table>
      <TableCaption>A list of moves made.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Captured</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Piece</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moves.map((move, index) => (
          <TableRow key={index}>
            <TableCell>{move.from}</TableCell>
            <TableCell>{move.to}</TableCell>
            <TableCell>{move.captured ? move.captured : "null"}</TableCell>
            <TableCell>{move.promotion ? move.promotion : "null"}</TableCell>
            <TableCell>{move.piece}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
