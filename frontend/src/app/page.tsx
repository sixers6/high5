import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ApiService from '../lib/api';
import MainLayout from '../components/layout/MainLayout';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import SidebarItem from '../components/layout/SidebarItem';
import ChatInterface from '../components/chat/ChatInterface';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toolbar from '../components/layout/Toolbar';
import ToolbarButton from '../components/ui/ToolbarButton';
import DynamicUIRenderer from '../components/ui/DynamicUIRenderer';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  metadata?: any;
}

interface Conversation {
  id: string;
  title: string;
  active: boolean;
}

export default function Home() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I am High5, your AI assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversations, setConversations] = React.useState<Conversation[]>([
    { id: '1', title: 'New conversation', active: true },
  ]);
  const [dynamicUI, setDynamicUI] = React.useState<any>(null);

  // Get the active conversation ID
  const activeConversation = conversations.find(conv => conv.active);
  const conversationId = activeConversation?.id || '1';

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      status: 'sending',
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to backend
      const response = await ApiService.sendMessage(content, conversationId);
      
      // Update user message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
      
      // Add agent response
      const agentMessage: ChatMessage = {
        id: response.messageId || uuidv4(),
        content: response.content,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
        metadata: response.metadata,
      };
      
      setMessages((prev) => [...prev, agentMessage]);
      
      // Check if the response includes a suggestion to generate UI
      if (response.metadata?.suggestedAction === 'generateUI') {
        handleGenerateUI(response.metadata.parameters);
      } else {
        // Clear any previous dynamic UI
        setDynamicUI(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateUI = async (parameters: any) => {
    try {
      const response = await ApiService.generateUI(
        parameters.type,
        parameters
      );
      
      setDynamicUI(response.components);
    } catch (error) {
      console.error('Error generating UI:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, there was an error generating the UI components. Please try again.',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleNewConversation = () => {
    // Set all conversations to inactive
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: false
    }));
    
    // Add new conversation
    const newConversation = {
      id: uuidv4(),
      title: 'New conversation',
      active: true
    };
    
    setConversations([newConversation, ...updatedConversations]);
    setMessages([
      {
        id: uuidv4(),
        content: 'Hello! I am High5, your AI assistant. How can I help you today?',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    
    // Clear any dynamic UI
    setDynamicUI(null);
  };

  const handleDynamicUISubmit = (data: any) => {
    // Add a message showing the submitted data
    const message: ChatMessage = {
      id: uuidv4(),
      content: `Form submitted with data: ${JSON.stringify(data, null, 2)}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      status: 'sent',
    };
    
    setMessages((prev) => [...prev, message]);
    
    // Clear the dynamic UI
    setDynamicUI(null);
  };

  return (
    <MainLayout
      header={
        <Header 
          title="High5" 
          subtitle="Your AI Assistant"
          actions={
            <Button onClick={handleNewConversation}>
              New Conversation
            </Button>
          }
        />
      }
      sidebar={
        <Sidebar>
          <div className="mb-4">
            <Button onClick={handleNewConversation} className="w-full">
              New Conversation
            </Button>
          </div>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <SidebarItem
                key={conv.id}
                label={conv.title}
                active={conv.active}
                onClick={() => {
                  // Set the selected conversation as active
                  setConversations(conversations.map(c => ({
                    ...c,
                    active: c.id === conv.id
                  })));
                }}
              />
            ))}
          </div>
        </Sidebar>
      }
    >
      <div className="flex flex-col h-full">
        <Toolbar>
          <ToolbarButton 
            label="Clear Chat" 
            onClick={() => {
              setMessages([
                {
                  id: uuidv4(),
                  content: 'Hello! I am High5, your AI assistant. How can I help you today?',
                  sender: 'agent',
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
              setDynamicUI(null);
            }} 
          />
        </Toolbar>
        <div className="flex-1 p-4">
          <Card className="h-full">
            <div className="flex flex-col h-full">
              <div className={`flex-1 ${dynamicUI ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`${dynamicUI ? 'flex-1 mb-4 md:mb-0 md:mr-4' : 'h-full'}`}>
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
                
                {dynamicUI && (
                  <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white">
                    <DynamicUIRenderer 
                      components={dynamicUI} 
                      onSubmit={handleDynamicUISubmit}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
