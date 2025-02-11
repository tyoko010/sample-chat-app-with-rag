import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  const bubbleClass = isUser
    ? "ml-auto"
    : "";

  return (
    <Card className={cn(
      "w-fit break-words mb-2 p-3 rounded-xl whitespace-pre-line",
      bubbleClass
    )}>
      {content}
    </Card>
  );
}
