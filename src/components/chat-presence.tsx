"use client";

import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ChatPresence() {
  const user = useUser((state) => state.user);
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("chat");
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Synced presence state: ", channel.presenceState());

        const userIds = [];
        for (const id in channel.presenceState()) {
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }

        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
    </div>
  );
}
