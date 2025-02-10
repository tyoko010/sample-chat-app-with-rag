'use client'

import { useState, FormEventHandler } from "react";
import ChatBubble from "./chatbubble";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// サーバーからのレスポンス型
type RetrieveResponse = {
  answer: string;
  sources: string[];
};

type Message = {
  role: "user" | "system";
  content: string;
};

function ChatApp() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // 送信ボタン押下時のハンドラ
  const handleSendMessage = async () => {
    if (!question.trim()) return;

    // ユーザーのメッセージを追加
    const newUserMessage: Message = {
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");

    // retrieve APIに問い合わせ
    try {
      const response = await fetch("http://127.0.0.1:8000/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RetrieveResponse = await response.json();

      // APIから受け取った回答をチャット履歴に追加
      setMessages((prev) => [
        ...prev,
        { role: "system", content:  formatAnswer(data) },
      ]);
    } catch (error) {
      console.error("API call failed:", error);
      // エラー時のメッセージ等
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "エラーが発生しました。" },
      ]);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    handleSendMessage();
  };

  const formatAnswer = (data: RetrieveResponse) => {
    const { answer, sources } = data;
    const sourceText = sources.map((src, idx) => `(${idx + 1}) ${src}`).join("\n");
    return `${answer}\n\n出典:\n${sourceText}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ヘッダー */}
      <header className="py-3 px-4">
        <h1 className="text-xl font-bold">Simple Chat App with Local Store</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 flex flex-col">
        {/* チャット履歴表示 */}
        <div className="flex-1 overflow-auto mb-4 w-4xl m-auto">
          {messages.map((msg, index) => (
            <ChatBubble key={index} role={msg.role} content={msg.content} />
          ))}
        </div>

        {/* 入力・送信UI */}
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="ここに質問を入力..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button type="submit">
            送信
          </Button>
        </form>
      </main>
    </div>
  );
}

export default ChatApp;
