"use client";

import React from "react";
import { ChatInput, useChatUI, useFile } from "@llamaindex/chat-ui";
import { DocumentInfo, ImagePreview } from "@llamaindex/chat-ui/widgets";
import { LlamaCloudSelector } from "./custom/llama-cloud-selector";
import { useClientConfig } from "./hooks/use-config";
import { AutoResizeTextarea } from "./tools/AutoResizeTextarea";

export default function CustomChatInput() {
  const { requestData, isLoading, input, setInput } = useChatUI();
  const { backend } = useClientConfig();
  const {
    imageUrl,
    setImageUrl,
    uploadFile,
    files,
    removeDoc,
    reset,
    getAnnotations,
  } = useFile({ uploadAPI: `${backend}/api/chat/upload` });

  /**
   * Handles file uploads. Overwrite to hook into the file upload behavior.
   * @param file The file to upload
   */
  const handleUploadFile = async (file: File) => {
    // There's already an image uploaded, only allow one image at a time
    if (imageUrl) {
      alert("You can only upload one image at a time.");
      return;
    }

    try {
      // Upload the file and send with it the current request data
      await uploadFile(file, requestData);
    } catch (error: any) {
      // Show error message if upload fails
      alert(error.message);
    }
  };

  // Get references to the upload files in message annotations format, see https://github.com/run-llama/chat-ui/blob/main/packages/chat-ui/src/hook/use-file.tsx#L56
  const annotations = getAnnotations();

  return (
    <ChatInput
      className="bg-white dark:bg-zinc-800 rounded-2xl p-4 flex flex-col gap-2 shadow-lg border border-gray-200 dark:border-zinc-700 max-w-full"
      resetUploadedFiles={reset}
      annotations={annotations}
    >
      <div>
        {/* Image preview section */}
        {imageUrl && (
          <ImagePreview url={imageUrl} onRemove={() => setImageUrl(null)} />
        )}
        {/* Document previews section */}
        {files.length > 0 && (
          <div className="flex gap-4 w-full overflow-auto py-2">
            {files.map((file) => (
              <DocumentInfo
                key={file.id}
                document={{ url: file.url, sources: [] }}
                className="mb-2 mt-2"
                onRemove={() => removeDoc(file)}
              />
            ))}
          </div>
        )}
      </div>

      <ChatInput.Form className="flex flex-col gap-3">
        <AutoResizeTextarea
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (!isLoading && (input.trim() || files.length > 0 || imageUrl)) {
        // Submit the form programmatically
        const form = e.currentTarget.closest("form");
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
    }
  }}
  placeholder="Ask anything"
  className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-xl focus:outline-none"
/>

        <div className="flex justify-between items-center gap-2 flex-wrap">
          <div className="flex gap-2">
            <ChatInput.Upload
              onUpload={handleUploadFile}
              className="rounded-full border border-gray-300 dark:border-zinc-600 p-2 hover:bg-gray-100 dark:hover:bg-zinc-700"
            />
            <LlamaCloudSelector />
          </div>
          <ChatInput.Submit
            data-submit-button
            className="bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700 disabled:opacity-50"
            disabled={
            isLoading || (!input.trim() && files.length === 0 && !imageUrl)
            }
          />
        </div>
      </ChatInput.Form>
    </ChatInput>
  );
}
