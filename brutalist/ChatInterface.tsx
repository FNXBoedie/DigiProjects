import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  height?: string;
  width?: string;
  title?: string;
  theme?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  onSendMessage?: (message: string) => Promise<string>;
}

export function ChatInterface({
  height = '600px',
  width = '100%',
  title = 'BRUTALIST CHAT v1.0',
  theme = {
    primary: 'black',
    secondary: '#f0f0f0',
    text: 'white',
    background: 'white'
  },
  onSendMessage
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;
      if (onSendMessage) {
        response = await onSendMessage(input);
      } else {
        // Default response if no handler provided
        response = "I'm a brutalist chat interface. Connect me to MistralAI to make me smarter!";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const style = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--text': theme.text,
    '--background': theme.background,
  } as React.CSSProperties;

  return (
    <div 
      className="font-mono flex flex-col border-4 bg-[var(--background)]"
      style={{ 
        ...style,
        height,
        width,
        borderColor: theme.primary
      }}
    >
      {/* Header */}
      <div 
        className="p-4 text-xl font-bold tracking-tight"
        style={{
          backgroundColor: theme.primary,
          color: theme.text
        }}
      >
        {title}
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: theme.secondary }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div 
              className={`p-2 ${
                message.role === 'user' 
                  ? 'text-[var(--text)]' 
                  : 'border-4'
              } max-w-[80%]`}
              style={{
                backgroundColor: message.role === 'user' ? theme.primary : theme.background,
                borderColor: message.role === 'assistant' ? theme.primary : 'transparent'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border-t-4"
        style={{
          backgroundColor: theme.secondary,
          borderColor: theme.primary
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border-4 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              borderColor: theme.primary,
              backgroundColor: theme.background,
              color: theme.primary
            }}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 transition-colors disabled:opacity-50"
            style={{
              backgroundColor: theme.primary,
              color: theme.text
            }}
            disabled={isLoading}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}