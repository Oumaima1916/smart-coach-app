const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// pill-shaped filter row for selecting workout difficulty
export default function WorkoutFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex justify-center gap-3 mb-10">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeFilter === filter
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
