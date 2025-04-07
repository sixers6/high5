import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar = ({ children, className = '' }: SidebarProps) => {
  return (
    <div className={`w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto ${className}`}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
