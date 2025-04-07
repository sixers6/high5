import React from 'react';

interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
  id?: string;
  rows?: number;
  maxLength?: number;
}

const Textarea = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  required = false,
  name,
  id,
  rows = 4,
  maxLength,
}: TextareaProps) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
      rows={rows}
      maxLength={maxLength}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 resize-y ${className}`}
    />
  );
};

export default Textarea;
