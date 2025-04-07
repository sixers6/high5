import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

const Toolbar = ({ children, className = '' }: ToolbarProps) => {
  return (
    <div className={`flex items-center space-x-2 p-2 bg-gray-100 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Toolbar;
