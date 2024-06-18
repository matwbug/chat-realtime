"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMessage } from "@/lib/store/messages";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";

export function EditAlert() {
  const actionsMessage = useMessage((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessage(
    (state) => state.optimisticUpdateMessage
  );
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleEditMessage = async () => {
    const supabase = createClient();
    const text = inputRef.current.value.trim();

    if (text && actionsMessage) {
      optimisticUpdateMessage({ ...actionsMessage, text, is_edit: true });
      const { error } = await supabase
        .from("messages")
        .update({ text, is_edit: true })
        .eq("id", actionsMessage?.id!);

      if (error) {
        toast.error(
          "Não foi possível editar a mensagem, tente novamente mais tarde"
        );
      } else {
        toast.success("A mensagem foi editada com sucesso!");
      }
      document.getElementById("trigger-edit")?.click();
    } else {
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-remove")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edite a mensagem</DialogTitle>
          <DialogDescription>
            Faça as alterações na mensagem, clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Input
          id="username"
          defaultValue={actionsMessage?.text}
          ref={inputRef}
        />

        <DialogFooter>
          <Button onClick={handleEditMessage} className="w-full" type="submit">
            Confirmar alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAlert() {
  const actionsMessage = useMessage((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  );

  const handleDeleteMessage = async () => {
    const supabase = createClient();

    optimisticDeleteMessage(actionsMessage?.id!);

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionsMessage?.id!);

    if (error) {
      toast.error(
        "Não foi possível excluir a mensagem, tente novamente mais tarde!"
      );
    } else {
      toast.success("A mensagem foi excluída com sucesso!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível. Ela irá excluir permanentemente a mensagem
            de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
