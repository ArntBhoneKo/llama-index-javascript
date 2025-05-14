"use client";

import { ChatMessage, ChatMessages, useChatUI } from "@llamaindex/chat-ui";
import { ChatMessageContent } from "./chat-message-content";
import { ChatStarter } from "./chat-starter";

export default function CustomChatMessages() {
  const { messages } = useChatUI();
  const hasMessages = messages.length > 0;

  return (
    <ChatMessages className="bg-white text-black px-4 py-6 rounded-xl shadow overflow-y-auto">
      <ChatMessages.List>
        {!hasMessages && <ChatStarter />}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-100 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              <ChatMessage message={message} isLast={index === messages.length - 1}>
                <ChatMessageContent />
              </ChatMessage>
            </div>
          </div>
        ))}

        <ChatMessages.Loading />
      </ChatMessages.List>
      <ChatMessages.Actions />
    </ChatMessages>
  );
}
