import React from 'react';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => {
  return (
    <div 
      className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {icon && <div className="w-5 h-5">{icon}</div>}
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default SidebarItem;
