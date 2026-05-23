import { Send } from 'lucide-react';

// controlled text input row with send button for the chat interface
export default function ChatInput({ value, onChange, onSend, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask your AI coach anything…"
        disabled={disabled}
        className="w-full px-5 py-3.5 pr-14 bg-gray-50 rounded-full border border-gray-200 outline-none text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 transition-colors text-sm disabled:opacity-60"
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
