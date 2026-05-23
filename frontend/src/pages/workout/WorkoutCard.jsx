import { Clock, Flame, ArrowRight } from 'lucide-react';

// clickable card that previews a single workout in the grid
export default function WorkoutCard({ workout, onClick }) {
  return (
    <button
      onClick={() => onClick(workout)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] text-left w-full"
    >
      <div className="relative h-48">
        <img
          src={workout.image}
          alt={workout.title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold ${workout.difficultyColor}`}
        >
          {workout.difficulty}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-white font-semibold text-sm">{workout.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {workout.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            {workout.calories} kcal
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
          View Details
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </button>
  );
}
