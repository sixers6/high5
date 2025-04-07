import React from 'react';

interface MainLayoutProps {
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ header, sidebar, children, className = '' }: MainLayoutProps) => {
  return (
    <div className={`flex flex-col h-screen ${className}`}>
      {header}
      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
