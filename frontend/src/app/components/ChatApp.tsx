'use client'

import { useState, FormEventHandler } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ChatBubble } from "./ChatBubble";
import { useSelectedVersion } from "./ModelVersionContext";

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

export function ChatApp() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedVersion } = useSelectedVersion();

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
        body: JSON.stringify({
          message: question,
          model: selectedVersion.key,
        }),
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
      <main className="flex-1 flex flex-col w-4/5 mx-auto p-4">
        {/* チャット履歴表示 */}
          {messages.map((msg, index) => (
            <ChatBubble key={index} role={msg.role} content={msg.content} />
          ))}
      </main>
      {/* 入力・送信UI */}
      <form
        className="sticky bottom-0 bg-background p-4"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto flex gap-2">
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
    </div>
  );
}

