import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils';

interface EditableProps {
  text: string;
  tagName?: React.ElementType;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Editable: React.FC<EditableProps> = ({
  text,
  tagName: Tag = 'div',
  className,
  onChange,
  placeholder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      onChange(contentRef.current.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        contentRef.current?.blur();
    }
  };

  // We only sync external prop changes when NOT editing to avoid cursor jumping
  useEffect(() => {
    if (contentRef.current && !isEditing && text !== contentRef.current.innerText) {
      contentRef.current.innerText = text;
    }
  }, [text, isEditing]);

  return (
    <Tag
      ref={contentRef}
      className={cn(
        'outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 transition-all empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 cursor-text',
        className
      )}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={() => setIsEditing(true)}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
    />
  );
};