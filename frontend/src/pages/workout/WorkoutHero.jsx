import React from 'react'

// full bleed hero banner shown at the top of the workout list view
const WorkoutHero = () => {
  return (
    <div className="relative w-full h-72 overflow-hidden rounded-2xl shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
        alt="Workouts hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1200px] mx-auto px-8 w-full">
          <h1 className="text-white text-4xl font-semibold mb-3">
            Free Workout Plans
          </h1>
          <p className="text-white/90 text-lg max-w-xl">
            choose from our collection of expert designed workouts tailored to your fitness level
          </p>
        </div>
      </div>
    </div>
  )
}

export default WorkoutHero