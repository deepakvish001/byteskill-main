
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Editor = ({ value, onChange, placeholder, className }: EditorProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`min-h-[200px] bg-gray-800 border-gray-700 text-white ${className}`}
      rows={10}
    />
  );
};
