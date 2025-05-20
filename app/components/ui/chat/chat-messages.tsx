"use client";

import { ChatMessage, ChatMessages, useChatUI } from "@llamaindex/chat-ui";
import { ChatMessageContent } from "./chat-message-content";
import { ChatStarter } from "./chat-starter";
import CustomChatActions from "./custom/custom-chat-actions";

export default function CustomChatMessages() {
  const { messages } = useChatUI();
  const hasMessages = messages.length > 0;

  return (
    <ChatMessages className="bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-6 rounded-xl shadow overflow-y-auto">
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
              className={`${
                message.role === "user" ? "max-w-[70%]" : "w-full"
              } px-4 py-2 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-600 text-black dark:text-white"
                  : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
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
      <CustomChatActions />
    </ChatMessages>
  );
}
