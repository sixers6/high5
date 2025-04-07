import React from 'react';
import Message from './Message';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ChatMessageType {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInterface = ({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            status={message.status}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? 'Processing...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
