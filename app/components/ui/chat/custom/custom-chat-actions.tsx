"use client";

import { useChatMessages, useChatUI } from "@llamaindex/chat-ui";
import { PauseCircle, RefreshCw } from "lucide-react"; // or any icon lib

export default function CustomChatActions({ className = "" }: { className?: string }) {
  const { stop, reload, requestData } = useChatUI();
  const { showStop, showReload } = useChatMessages();

  if (!showStop && !showReload) return null;

  return (
    <div className={`flex justify-end gap-3 mt-4 ${className}`}>
      {showStop && (
        <button
          onClick={stop}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition shadow-sm border border-gray-300"
        >
          <PauseCircle className="h-4 w-4 text-gray-500" />
          Stop
        </button>
      )}
      {showReload && (
        <button
          onClick={() => reload?.({ data: requestData })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition shadow-sm border border-blue-300"
        >
          <RefreshCw className="h-4 w-4 text-blue-600" />
          Regenerate
        </button>
      )}
    </div>
  );
}
