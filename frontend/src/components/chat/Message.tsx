import React from 'react';

interface MessageProps {
  content: string;
  sender: 'user' | 'agent';
  timestamp?: string;
  status?: 'sending' | 'sent' | 'error';
}

const Message = ({ content, sender, timestamp, status }: MessageProps) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div className="text-sm">{content}</div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {timestamp && <span className="mr-2">{timestamp}</span>}
          {status && isUser && (
            <span>
              {status === 'sending' && '• Sending...'}
              {status === 'sent' && '• Sent'}
              {status === 'error' && '• Failed to send'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
