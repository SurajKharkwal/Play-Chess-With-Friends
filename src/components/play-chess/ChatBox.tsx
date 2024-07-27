import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Roles } from "@/hooks/useInitialGameData";
import { socket } from "@/socket";
import { FormEventHandler, useEffect, useRef, useState } from "react";

type SelectRole = "white" | "black" | "all";
type messageListType = {
  to: SelectRole;
  from: Roles;
  message: string;
};

function DisplayMessage({ from, message }: { from: Roles; message: string }) {
  return (
    <div className="flex gap-2 w-full">
      <span
        className={`${
          from !== "spectator" ? "bg-red-500" : "bg-green-500"
        } text-black h-min rounded-md px-2`}
      >
        {from === "spectator" ? "SPEC." : from.toUpperCase()}
      </span>
      <p className={from !== "spectator" ? "text-red-200" : "text-green-200"}>
        {message}
      </p>
    </div>
  );
}

export default function ChatBox({
  roomId,
  myRole,
}: {
  roomId: string;
  myRole: Roles;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedRole, setSelectedRole] = useState<SelectRole>("all");
  const [messageList, setMessageList] = useState<messageListType[]>([]);

  useEffect(() => {
    const handleReceiveMessage = (messageObj: messageListType) => {
      setMessageList((prevMessageList) => [...prevMessageList, messageObj]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim()) {
        const messageObj = { to: selectedRole, message, from: myRole };
        socket.emit("send-message", roomId, messageObj);
        setMessageList((prevMessageList) => [...prevMessageList, messageObj]);
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Checkmate Chats</CardTitle>
        <CardDescription>Chat with opponents and spectators</CardDescription>
      </CardHeader>
      <CardContent>
        <section>
          <article className="flex mb-4 h-[300px] overflow-scroll overflow-x-hidden flex-col py-2 text-neutral-500 gap-2 w-full border-2 rounded-sm px-2">
            {messageList.length > 0
              ? messageList.map((messageElement, index) => (
                  <DisplayMessage
                    key={index}
                    from={messageElement.from}
                    message={messageElement.message}
                  />
                ))
              : null}
          </article>
          <form
            onSubmit={handleSubmit}
            className="flex h-10 items-center rounded-md border border-input text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <Select
              value={selectedRole}
              onValueChange={(value: SelectRole) => setSelectedRole(value)}
            >
              <SelectTrigger className="w-min focus-visible:outline-none">
                <SelectValue
                  placeholder="All"
                  className="focus-visible:outline-none"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem
                    disabled={myRole === "white" || myRole === "spectator"}
                    value="white"
                  >
                    White
                  </SelectItem>
                  <SelectItem
                    disabled={myRole === "black" || myRole === "spectator"}
                    value="black"
                  >
                    Black
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              ref={inputRef}
              type="text"
              name="messageBox"
              className="bg-transparent w-full h-full focus-visible:outline-none pl-3"
              placeholder="Enter the message"
            />
          </form>
        </section>
      </CardContent>
    </Card>
  );
}
