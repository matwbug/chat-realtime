import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import InitMessages from "@/lib/store/initMessages";
import InitUser from "@/lib/store/initUser";
import { createClient } from "@/lib/supabase/server";
import { LIMIT_MESSAGE } from "@/lib/utils";

export default async function Home() {
  const supabase = createClient();
  const resultMessage = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });
  const resultUser = await supabase.auth.getUser();

  return (
    <main className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col relative">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
        <InitUser user={resultUser.data.user || undefined} />
        <InitMessages messages={resultMessage.data?.reverse() || []} />
      </div>
    </main>
  );
}
