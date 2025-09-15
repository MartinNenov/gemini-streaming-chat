
import React from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        disabled={isLoading}
        className="w-full p-4 pr-16 bg-[#cfcfcf17] border border-[#ededed] rounded-lg resize-none focus:outline-none focus:ring-2 transition-shadow duration-200 text-gray-700 placeholder-gray-500"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#d4e8ff] text-gray-700 hover:bg-[#b4d7ff] disabled:bg-[rgb(223 223 223 / 87%)] disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatInput;
