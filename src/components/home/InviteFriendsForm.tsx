"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect, useMemo } from "react";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardCopy, Copy } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function InviteFriendsForm() {
  const [room, setRoom] = useState<"join" | "create">("create");
  const [roomId, setRoomId] = useState(nanoid());

  useEffect(() => {
    if (room === "create") {
      setRoomId(nanoid());
    } else {
      setRoomId("");
    }
  }, [room]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      alert("Room ID copied to clipboard!");
    });
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setRoomId(text);
  };

  const handleRoom = () => {
    setRoom((prev) => (prev === "create" ? "join" : "create"));
  };
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>
        Invite a friend
      </DialogTrigger>
      <DialogContent aria-describedby={"Room Form"} className="w-96 f">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Basic Information
          </DialogTitle>
          <DialogDescription className="w-full flex items-center justify-start">
            Enter the details {room} room
          </DialogDescription>
        </DialogHeader>
        <form className="w-2/3 space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="nanoID">Room ID</Label>
            <section className="flex gap-2 w-full items-center cursor-pointer">
              <Input
                type="text"
                id="nanoID"
                readOnly={room === "create"}
                className="w-60"
                value={roomId}
                placeholder={room === "join" ? "Enter the Room Id" : ""}
                onChange={(e) => setRoomId(e.target.value)}
              />
              {room === "join" ? (
                <span
                  className={cn(
                    (buttonVariants({ variant: "outline" }),
                    "flex items-center gap-x-1")
                  )}
                  onClick={handlePaste}
                >
                  <ClipboardCopy />
                  Paste
                </span>
              ) : (
                <span
                  className={cn(
                    (buttonVariants({ variant: "outline" }),
                    "flex items-center gap-x-1")
                  )}
                  onClick={handleCopy}
                >
                  <Copy size={25} />
                  Copy
                </span>
              )}
            </section>
          </div>
        </form>
        <DialogFooter className="sm:justify-end gap-2">
          <Button onClick={handleRoom} variant={"outline"}>
            {room === "create" ? "Join Room" : "Create Room"}
          </Button>
          <Link
            href={`/play-chess?roomId=${roomId}`}
            className={buttonVariants()}
          >
            Play Game
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
