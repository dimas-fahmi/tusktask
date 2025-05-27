import { SetStateAction } from "@/src/types/types";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { ScrollArea } from "@/src/ui/components/shadcn/ui/scroll-area";
import ChatCard from "@/src/ui/components/tusktask/prefabs/ChatCard";
import { Send } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

const TeamChatDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: SetStateAction<boolean>;
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages] = useState(
    Array(6)
      .fill("")
      .map((_, index) => ({
        id: index,
        type: index % 2 === 0 ? "receive" : "send",
      }))
  );

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (open) {
      // Small delay to ensure the dialog is fully rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Header [hidden] */}
      <DialogHeader>
        <DialogTitle className="sr-only">Chat Dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog for team chats
        </DialogDescription>
      </DialogHeader>
      {/* Content */}
      <DialogContent className="p-0 max-h-[420px] flex flex-col">
        <ScrollArea className="h-[320px]" ref={scrollAreaRef}>
          <div className="flex gap-4 p-4 flex-col">
            {messages.map((message, index) => (
              <ChatCard type={message.type as any} key={message.id} />
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-3 items-center max-h-[60px]">
            <textarea
              rows={3}
              className="text-sm block p-2 border rounded-md w-full resize-none field-sizing-content min-h-11 max-h-48 scrollbar-none flex-grow"
              placeholder="Say something..."
            />
            <Button variant={"outline"} className="">
              <Send />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamChatDialog;
