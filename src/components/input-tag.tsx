
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface InputTagProps {
  id?: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export const InputTag = ({ id, placeholder, values, onChange }: InputTagProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !values.includes(trimmedValue)) {
        onChange([...values, trimmedValue]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(values.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bg-gray-800 border-gray-700 text-white"
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {value}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
