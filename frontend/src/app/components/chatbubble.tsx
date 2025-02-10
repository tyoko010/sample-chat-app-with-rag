import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChatBubbleProps = {
  role: "user" | "system";
  content: string;
};

function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  const bubbleClass = isUser
    ? "ml-auto"
    : "";

  return (
    <Card className={cn(
      "w-fit break-words mb-2 p-3 rounded-xl",
      bubbleClass
    )}>
      <pre>{content}</pre>
    </Card>
  );
}

export default ChatBubble;