"use client";
import { FaGithub } from "react-icons/fa";
import { GiChessKing } from "react-icons/gi";
import { SiLichess } from "react-icons/si";

export default function Navbar() {
  return (
    <nav className=" flex mb-auto items-center h-20 px-8 border-b-2 justify-center w-full border-neutral-500/10 ">
      <div className="max-w-7xl w-full flex items-center ">
        <section className="flex items-center mr-auto gap-4">
          <SiLichess
            size={40}
            className=" mr-auto text-5xl  sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold cursor-pointer"
            color="#525252"
            href="/"
          />
          <h1 className=" text-2xl mr-auto sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-bold">
            ChessMate
          </h1>
        </section>
        <FaGithub
          size={40}
          color="#525252"
          href="/test"
          className="cursor-pointer  text-5xl  sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold"
        />
      </div>
    </nav>
  );
}
