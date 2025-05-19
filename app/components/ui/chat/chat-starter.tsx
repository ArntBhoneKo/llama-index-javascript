import { useChatUI } from "@llamaindex/chat-ui";
import { StarterQuestions } from "@llamaindex/chat-ui/widgets";
import { useEffect, useState } from "react";
import { useClientConfig } from "./hooks/use-config";

export function ChatStarter() {
  const { append } = useChatUI();
  const { backend } = useClientConfig();
  const [starterQuestions, setStarterQuestions] = useState<string[]>();

  useEffect(() => {
    if (!starterQuestions) {
      fetch(`${backend}/api/chat/config`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.starterQuestions) {
            setStarterQuestions(data.starterQuestions);
          }
        })
        .catch((error) => console.error("Error fetching config", error));
    }
  }, [starterQuestions, backend]);

  if (!starterQuestions?.length) return null;

  return (
    <div className="w-full px-4 py-6">
      <p className="mb-4 text-base font-medium text-gray-800 dark:text-white">
        What do you want to ask today?
      </p>
      <div className="flex flex-wrap gap-3">
        {starterQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => append({ role: "user", content: q })}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition text-sm w-full sm:w-auto text-center"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
