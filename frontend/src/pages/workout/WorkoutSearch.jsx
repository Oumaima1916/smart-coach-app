import { Search, X } from 'lucide-react';

// controlled search input for filtering workouts by title keyword
export default function WorkoutSearch({ value, onChange }) {
  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search workouts, exercises…"
          className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl border border-gray-200 outline-none text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-emerald-400 focus:shadow-md transition-all text-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
