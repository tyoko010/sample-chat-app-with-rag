// ユーザーメッセージとシステム回答を分けて表現するためのコンポーネント
type ChatBubbleProps = {
  role: "user" | "system";
  content: string;
};

function ChatBubble({ role, content }: ChatBubbleProps) {
  // roleに応じてバブルのスタイルを切り替え
  const isUser = role === "user";

  const bubbleClass = isUser
    ? "bg-gray-600 text-gray-100 self-end"
    : "bg-gray-300 text-gray-800 self-start";

  return (
    <div className={`w-fit break-words mb-2 p-3 rounded-xl ${bubbleClass}`}>
      {/* 改行表示を反映するため、dangerouslySetInnerHTMLまたはpreタグなどを使用 */}
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
}

export default ChatBubble;