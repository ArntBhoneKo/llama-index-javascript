import React, { useRef, useEffect, ChangeEvent } from "react";

export interface AutoResizeTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A textarea that automatically expands to fit its content.
 */
export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onChange?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      className={`resize-none overflow-hidden ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
    />
  );
}
