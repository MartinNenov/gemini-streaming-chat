
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, Role } from './types';
import { streamChatResponse } from './services/geminiService';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { BotIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'model',
      content: "Hello! I'm Gemini. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessageType = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add a placeholder for the model's response
    setMessages(prevMessages => [...prevMessages, { role: 'model', content: '' }]);

    try {
      const stream = streamChatResponse(input, messages.filter(m => m.role !== 'model' || m.content !== ''));

      for await (const chunk of stream) {
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunk };
            return [...prevMessages.slice(0, -1), updatedLastMessage];
          }
          return prevMessages;
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(`Error: ${errorMessage}`);
      setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model' && lastMessage.content === '') {
            const updatedLastMessage = { ...lastMessage, content: `Sorry, I encountered an error. ${errorMessage}` };
            return [...prevMessages.slice(0, -1), updatedLastMessage];
          }
          return [...prevMessages, { role: 'model', content: `Sorry, I encountered an error. ${errorMessage}` }]
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-white backdrop-blur-sm p-4 border-b shadow-lg flex items-center gap-3">
        <BotIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold text-gray-800">Gemini AI Stream Chat</h1>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#e8f4ff]">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.role === 'user' && (
           <ChatMessage message={{role: 'model', content: ''}} isLoading={true} />
        )}
      </main>

      {error && (
        <div className="p-4 bg-[#ff7a81a8] text-[#ffc4c4]">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      <footer className="p-4 bg-white backdrop-blur-sm">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
        />
      </footer>
    </div>
  );
};

export default App;
