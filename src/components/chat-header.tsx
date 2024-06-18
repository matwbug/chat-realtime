"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/lib/store/user";
import ChatPresence from "./chat-presence";

export function ChatHeader() {
  const router = useRouter();

  function handleLoginLoginWithGithub() {
    const supabase = createClient();

    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.href + "/auth/callback",
      },
    });
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();

    router.refresh();
  }

  const user = useUser((state) => state.user);

  return (
    <div className="h-20 p-5 border-b flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Chat</h1>
        <ChatPresence />
      </div>
      {user ? (
        <div className="flex flex-row gap-1 items-center">
          <div className="flex flex-row gap-1 items-center">
            <Image
              alt=""
              width={30}
              height={30}
              className="rounded-full"
              src={user.user_metadata.avatar_url}
            />
            <span>{user.user_metadata.user_name}</span>
          </div>
          <Button size={"icon"} variant="link" onClick={handleLogout}>
            <LogOut className="text-red-500" size={16} />
          </Button>
        </div>
      ) : (
        <Button onClick={handleLoginLoginWithGithub}>Login</Button>
      )}
    </div>
  );
}
