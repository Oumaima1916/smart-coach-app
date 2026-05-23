import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import CoachFeatureCards from './CoachFeatureCards';

const RANDOM_REPLIES = [
  'Great question! Based on your current fitness level, I would recommend starting with a mix of strength training and cardio. Let me put together a plan tailored to your goals.',
  'For optimal results, focus on compound movements like squats, deadlifts, and bench press. These engage multiple muscle groups and burn the most calories.',
  'Consistency is key! Aim for at least 150 minutes of moderate-intensity exercise per week. I can help you break that down into manageable daily sessions.',
  'Do not forget recovery! Rest days are just as important as workout days. Your muscles grow and repair during rest, so prioritise sleep and nutrition.',
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hi! I am your AI fitness coach. I can help you create personalised workout plans, answer nutrition questions, provide exercise tips, and guide you on your fitness journey. What would you like to know today?',
  },
];

// top-level page — manages chat state and delegates rendering to sub-components
export default function AICoach() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const hasUserMessages = messages.some((m) => m.role === 'user');

  const sendMessage = (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)],
      };
      setMessages((prev) => [...prev, reply]);
    }, 1400);
  };

  const handleSuggestionSelect = (suggestionText) => {
    setInput(suggestionText);
  };

  return (
    <div>
      {/* full-bleed hero */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="AI Coach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1200px] mx-auto px-8 w-full">
            <h1 className="text-white text-4xl font-semibold mb-3">
              AI Fitness Coach
            </h1>
            <p className="text-white/90 text-lg max-w-xl">
              Get personalised fitness guidance and coaching powered by artificial intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-20">
        <div className="max-w-3xl mx-auto">

          {/* chat window */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <MessageList messages={messages} isTyping={isTyping} />

            <div className="border-t border-gray-100 p-5">
              {!hasUserMessages && (
                <SuggestionChips onSelect={handleSuggestionSelect} />
              )}
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={() => sendMessage()}
                disabled={isTyping}
              />
            </div>
          </div>

          <CoachFeatureCards />
        </div>
      </div>
    </div>
  );
}
