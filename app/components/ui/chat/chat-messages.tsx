"use client";

import { ChatMessage, ChatMessages, useChatUI } from "@llamaindex/chat-ui";
// import { ChatMessageAvatar } from "./chat-avatar";
import { ChatMessageContent } from "./chat-message-content";
import { ChatStarter } from "./chat-starter";

export default function CustomChatMessages() {
  const { messages } = useChatUI();
  const hasMessages = messages.length > 0;

  return (
    <ChatMessages className="shadow-xl rounded-xl">
      <ChatMessages.List>
        {/* Show ChatStarter only if no messages */}
        {!hasMessages && <ChatStarter />}

        {messages.map((message, index) => (
          <div key={index}>
            <div className="text-xs text-gray-500 mb-1 ml-2">
              {message.role === "user" ? "User" : "Bot"}
            </div>
            <ChatMessage
              key={index}
              message={message}
              isLast={index === messages.length - 1}
            >
              {/* <ChatMessageAvatar /> */}
              <ChatMessageContent />
              <ChatMessage.Actions />
            </ChatMessage>
            <div className="h-[2px] bg-gray-400 my-4 rounded" /> {/* Divider */}
          </div>
        ))}
        <ChatMessages.Loading />
      </ChatMessages.List>
      <ChatMessages.Actions />
    </ChatMessages>
  );
}
