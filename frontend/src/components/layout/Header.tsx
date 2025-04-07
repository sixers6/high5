import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const Header = ({ title, subtitle, actions, className = '' }: HeaderProps) => {
  return (
    <header className={`bg-white border-b border-gray-200 py-4 px-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </header>
  );
};

export default Header;
