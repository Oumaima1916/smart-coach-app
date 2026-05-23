import { useState } from 'react';
import MacroTracker from './MacroTracker';
import MealCard from './MealCard';

const MEALS = [
  {
    id: 1,
    name: 'Greek Yogurt Parfait',
    type: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1583577012041-b9fe16bf9345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 15,
    carbs: 32,
    fat: 8,
    typeColor: 'bg-orange-500',
  },
  {
    id: 2,
    name: 'Quinoa Power Bowl',
    type: 'Lunch',
    image: 'https://images.unsplash.com/photo-1543340713-1bf56d3d1b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 22,
    carbs: 45,
    fat: 12,
    typeColor: 'bg-cyan-500',
  },
  {
    id: 3,
    name: 'Grilled Salmon',
    type: 'Dinner',
    image: 'https://images.unsplash.com/photo-1613293984606-b797e2c48842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 35,
    carbs: 28,
    fat: 18,
    typeColor: 'bg-emerald-500',
  },
  {
    id: 4,
    name: 'Protein Smoothie',
    type: 'Snack',
    image: 'https://images.unsplash.com/photo-1551432512-7165c9992a13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 25,
    carbs: 18,
    fat: 5,
    typeColor: 'bg-purple-500',
  },
  {
    id: 5,
    name: 'Avocado Toast',
    type: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1620649214867-d0f1661f0d64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 12,
    carbs: 38,
    fat: 16,
    typeColor: 'bg-orange-500',
  },
  {
    id: 6,
    name: 'Chicken Salad',
    type: 'Lunch',
    image: 'https://images.unsplash.com/photo-1771074168439-0083aaac48e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    protein: 28,
    carbs: 22,
    fat: 10,
    typeColor: 'bg-cyan-500',
  },
];

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Snack', 'Dinner'];

// top-level nutrition page — manages active meal-type filter
export default function Nutrition() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All' ? MEALS : MEALS.filter((m) => m.type === activeFilter);

  return (
    <div>
      {/* full-bleed hero */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="Nutrition"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1200px] mx-auto px-8 w-full">
            <h1 className="text-white text-4xl font-semibold mb-3">
              Nutrition Planning
            </h1>
            <p className="text-white/90 text-lg max-w-xl">
              Plan your meals and track your macros with our comprehensive nutrition guide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-20">
        <MacroTracker />

        {/* filter pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* meals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        {/* daily tip banner */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="relative h-44">
            <img
              src="https://images.unsplash.com/photo-1615865417491-9941019fbc00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Healthy food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 max-w-lg">
                <p className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-1">
                  Daily Tip
                </p>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Stay Hydrated for Better Performance
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Drinking enough water throughout the day helps maintain energy
                  levels and supports muscle recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
