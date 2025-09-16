import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, BotIcon, CopyIcon, CheckIcon } from './Icons';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
);

const CodeBlock: React.FC<any> = ({ node, inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        if (!codeString) return;
        navigator.clipboard.writeText(codeString).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    if (inline) {
        return <code className={className} {...props}>{children}</code>;
    }

    return (
        <div className="relative group my-4">
            <pre
                {...props}
                className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-200 overflow-x-auto"
            >
                <code>
                    {children}
                </code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                aria-label={isCopied ? "Copied!" : "Copy code"}
            >
                {isCopied ? (
                    <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                    <CopyIcon className="w-4 h-4" />
                )}
            </button>
        </div>
    );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUserModel = message.role === 'user';
  
  const containerClasses = `flex items-start gap-4 max-w-4xl mx-auto ${isUserModel ? 'flex-row-reverse' : ''}`;
  const bubbleClasses = `p-4 rounded-xl max-w-[80%] ${isUserModel ? 'bg-[var(--color-canvas-default)] text-white rounded-br-none' : 'bg-[var(--color-canvas-default)] text-gray-200 rounded-bl-none'}`;
  const iconClasses = `w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mt-1 ${isUserModel ? 'bg-blue-500' : 'bg-cyan-500'}`;
  const articleClasses = isUserModel ? 'rounded-[15px] rounded-tr-[0px]' : 'rounded-[15px] rounded-tl-[0px]';

  return (
    <div className={containerClasses}>
      <div className={iconClasses}>
        {isUserModel ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-5 h-5" />}
      </div>
      <div className={bubbleClasses}>
        {(isLoading || message.content === '') ? (
          <LoadingIndicator />
        ) : (
          <article className={"prose prose-invert prose-sm md:prose-base max-w-none overflow-hidden " + articleClasses}>
            <MarkdownPreview source={message.content} style={{ padding: 16 }} />
          </article>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
