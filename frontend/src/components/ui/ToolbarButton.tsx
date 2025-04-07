import React from 'react';

interface ToolbarButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  tooltip?: string;
  className?: string;
}

const ToolbarButton = ({ 
  icon, 
  label, 
  onClick, 
  active = false, 
  tooltip,
  className = '' 
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label && <span className={`${icon ? 'ml-2' : ''}`}>{label}</span>}
    </button>
  );
};

export default ToolbarButton;
