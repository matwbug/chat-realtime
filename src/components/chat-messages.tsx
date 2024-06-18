"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { DisplayMessage } from "./display-message";
import { Imessage, useMessage } from "@/lib/store/messages";
import { DeleteAlert, EditAlert } from "./message-actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getUserById } from "@/lib/user";
import { ArrowDown, Bell } from "lucide-react";
import LoadMoreMessages from "./load-more-messages";

export function ChatMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const {
    addMessage,
    messages,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("chat_room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { data, error } = await getUserById(payload.new.send_by);

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };

              addMessage(newMessage as Imessage);
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  function handleOnScroll() {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScrolled(isScroll);

      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  }

  function scrollDown() {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          <Suspense fallback={"Carregando mensagens..."}>
            {messages.map((message) => {
              return <DisplayMessage message={message} key={message.id} />;
            })}
          </Suspense>
          <DeleteAlert />
          <EditAlert />
        </div>
      </div>
      {userScrolled && (
        <div className="absolute bottom-20 right-1/2 translate-x-1/2">
          {notification ? (
            <div
              onClick={scrollDown}
              className="p-2 px-3 gap-2 bg-indigo-500 rounded-full flex justify-center items-center mx-auto cursor-pointer"
            >
              <Bell />
              <span> Nova mensagem ({notification})</span>
            </div>
          ) : (
            <div
              onClick={scrollDown}
              className="w-10 h-10 bg-indigo-500 rounded-full flex justify-center items-center mx-auto cursor-pointer hover:scale-110 transition-all"
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}
