"use client";
import ChessboardHomeUI from "@/components/home/chess-ui";
import InviteFriendsForm from "@/components/home/InviteFriendsForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { MaxWidth } from "@/components/ui/max-width";
import { nanoid } from "nanoid";
import Link from "next/link";
import { Chessboard } from "react-chessboard";

export default function Home() {
  return (
    <MaxWidth className=" h-full space-y-6 ">
      <section className=" space-y-8 flex items-center justify-center flex-col">
        <h1 className=" text-5xl  sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-bold">
          ChessMate: Play Chess with Friends
        </h1>
        <h4 className=" text-center text-xl sm:text-2xl max-w-5xl text-neutral-400 ">
          ChessMate: Engage in exciting chess matches with friends, anytime,
          anywhere. Join our community and master the game together.
        </h4>
      </section>
      <section className=" flex  gap-4">
        <InviteFriendsForm />
        {/* <Link
          href={`/play-chess?isPrivate=${false}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Play With Random
        </Link> */}
      </section>
      <section className="w-max">
        <ChessboardHomeUI />
      </section>
    </MaxWidth>
  );
}
