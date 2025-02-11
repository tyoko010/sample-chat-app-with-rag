'use client'

import { useState, FormEventHandler } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ChatBubble from "./chatbubble";

type RetrieveResponse = {
  answer: string;
  sources: string[];
};

type ChatResponse = {
  message: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

function ChatApp() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // APIから受け取った回答をチャット履歴に追加
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message},
      ]);
    } catch (error) {
      console.error("API call failed:", error);
      // エラー時のメッセージ等
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "エラーが発生しました。" },
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
      <main className="flex-1 flex flex-col w-96 mx-auto p-4">
        {/* チャット履歴表示 */}
          {messages.map((msg, index) => (
            <ChatBubble key={index} role={msg.role} content={msg.content} />
          ))}

        {/* 入力・送信UI */}
        <form
          className="fixed bottom-0 left-0 right-0 bg-background p-4"
          onSubmit={handleSubmit}
        >
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              type="text"
              placeholder="メッセージを入力してください..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button type="submit">
              送信
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ChatApp;
