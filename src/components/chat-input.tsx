"use client";

import { KeyboardEvent, useState } from "react";
import { Input } from "./ui/input";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Imessage, useMessage } from "@/lib/store/messages";
import { v4 as uuid } from "uuid";
import { useUser } from "@/lib/store/user";

export function ChatInput() {
  const [text, setText] = useState("");
  const supabase = createClient();

  const { addMessage, setOptimisticIds } = useMessage((state) => state);
  const user = useUser((state) => state.user);

  async function handleSendMessage(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (text.trim()) {
        setText("");

        if (!user) {
          return toast.error(
            "Você deve fazer login para poder enviar mensagens"
          );
        }

        const newMessage: Imessage = {
          id: uuid(),
          created_at: new Date().toISOString(),
          is_edit: false,
          send_by: user.id,
          text,
          users: {
            id: user.id,
            avatar_url: user.user_metadata.avatar_url,
            created_at: new Date().toISOString(),
            display_name: user.user_metadata.user_name,
          },
        };

        addMessage(newMessage);
        setOptimisticIds(newMessage.id);

        const { error } = await supabase.from("messages").insert({
          text,
          id: newMessage.id,
          send_by: newMessage.send_by,
        });

        if (error) {
          toast.error(
            "Não foi possível enviar a mensagem, aconteceu alguma coisa :/"
          );
        }
      } else {
        toast.error("A mensagem não pode estar vazia");
      }
    }
  }

  return (
    <div className="p-5">
      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => handleSendMessage(e)}
        placeholder="send message"
      />
    </div>
  );
}
