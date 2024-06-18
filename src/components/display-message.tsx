"use client";

import { MessageProps } from "@/lib/types/chat";
import Image from "next/image";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export function DisplayMessage({ message }: { message: MessageProps }) {
  const user = useUser((state) => state.user);

  return (
    <div className="relative flex-1 flex flex-row gap-2 items-start">
      <Image
        alt=""
        width={30}
        height={30}
        className="rounded-full"
        src={
          message.users?.avatar_url ||
          `https://avatars.githubusercontent.com/u/22576136?s=200&v=4`
        }
      />
      <div className="flex flex-col gap-0 items-start">
        <div className="flex items-center gap-2">
          <span>{message.users?.display_name}</span>
          <span className="text-muted-foreground">
            {formatRelative(message.created_at, new Date(), {
              locale: ptBR,
            })}
          </span>
          {message.is_edit && <span className="text-gray-500">editado</span>}
        </div>
        <p className="text-gray-400">{message.text}</p>
      </div>
      {message.send_by === user?.id && <MessageMenu message={message} />}
    </div>
  );
}

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionsMessage = useMessage((state) => state.setActionMessage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-0 top-0">
        <MoreVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionsMessage(message);
          }}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionsMessage(message);
          }}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
