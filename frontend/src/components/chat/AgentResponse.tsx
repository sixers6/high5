import React from 'react';

interface AgentResponseProps {
  content: string;
  isLoading?: boolean;
  className?: string;
}

const AgentResponse = ({ content, isLoading = false, className = '' }: AgentResponseProps) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-500">Agent is thinking...</span>
        </div>
      ) : (
        <div className="prose max-w-none">
          {content}
        </div>
      )}
    </div>
  );
};

export default AgentResponse;
