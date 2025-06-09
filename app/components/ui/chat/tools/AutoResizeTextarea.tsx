import React, {
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  TextareaHTMLAttributes,
} from "react";

export interface AutoResizeTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * A textarea that automatically expands to fit its content.
 */
export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
  ...rest
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
      onKeyDown={onKeyDown}
      {...rest}
    />
  );
}
