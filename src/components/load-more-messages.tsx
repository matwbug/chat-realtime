import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { getFromAndTo, LIMIT_MESSAGE } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const { page, setMessages, hasMore } = useMessage((state) => state);

  async function fetchMore() {
    const supabase = createClient();

    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Não foi possível carregar mais mensagens");
    } else {
      setMessages(data.reverse());
    }
  }

  if (hasMore) {
    return (
      <Button
        className="w-full bg-transparent border"
        variant="outline"
        onClick={fetchMore}
      >
        Mais mensagens
      </Button>
    );
  }

  return <></>;
}
