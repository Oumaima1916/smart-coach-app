import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

// single message bubble — role determines alignment and color scheme
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-emerald-500' : 'bg-emerald-50'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-emerald-500" />
        )}
      </div>
      <div
        className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-500 text-white rounded-tr-sm'
            : 'bg-gray-50 text-gray-800 rounded-tl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

// animated three-dot indicator shown while the assistant is composing a reply
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <Bot className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// scrollable message feed with auto-scroll to bottom on new messages
export default function MessageList({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
