import { ArrowLeft, Clock, Flame, Play } from 'lucide-react';

// renders the full breakdown view for a selected workout
export default function WorkoutDetails({ workout, onBack }) {
  return (
    <div>
      {/* slim hero using the workout image */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={workout.image}
          alt={workout.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1200px] mx-auto px-8 w-full">
            <h1 className="text-white text-3xl font-semibold mb-2">
              {workout.title}
            </h1>
            <p className="text-white/85 text-base">
              {workout.difficulty} · {workout.duration} min
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pb-16">
        {/* back navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 mt-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workouts
        </button>

        {/* large image card with stats overlay */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-8">
          <div className="relative h-96">
            <img
              src={workout.image}
              alt={workout.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-4 ${workout.difficultyColor}`}
              >
                {workout.difficulty}
              </span>
              <h2 className="text-white text-3xl font-semibold mb-3">
                {workout.title}
              </h2>
              <p className="text-white/85 mb-6 max-w-2xl text-sm leading-relaxed">
                {workout.description}
              </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{workout.duration} min</p>
                    <p className="text-white/65 text-xs">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{workout.calories} kcal</p>
                    <p className="text-white/65 text-xs">Calories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* exercise breakdown list */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-10">
          <h2 className="text-gray-900 text-xl font-semibold mb-6">
            Exercise Breakdown
          </h2>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {exercise.name}
                    </p>
                    {exercise.sets && (
                      <p className="text-gray-500 text-xs mt-0.5">{exercise.sets}</p>
                    )}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{exercise.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* start cta */}
        <div className="flex justify-center">
          <button className="flex items-center gap-3 px-12 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl font-semibold text-base">
            <Play className="w-5 h-5 fill-white" />
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
}
