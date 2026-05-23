const SUGGESTIONS = [
  'Create a weekly workout plan for me',
  'Best exercises for weight loss',
  'How to improve my flexibility',
  'Nutrition tips for muscle gain',
];

// quick-tap prompt chips shown before the user sends their first message
export default function SuggestionChips({ onSelect }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm hover:bg-gray-50 hover:border-emerald-400 transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
