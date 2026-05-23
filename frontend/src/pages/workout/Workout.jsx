import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/workoutSlice';
import WorkoutHero from './WorkoutHero';
import WorkoutSearch from './WorkoutSearch';
import WorkoutFilters from './WorkoutFilters';
import WorkoutCard from './WorkoutCard';
import WorkoutDetails from './WorkoutDetails';

const WORKOUTS = [
  {
    id: '1',
    title: 'Morning Cardio Blast',
    image: 'https://images.unsplash.com/photo-1662386392870-1f47856cf78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Beginner',
    duration: 30,
    calories: 250,
    difficultyColor: 'bg-emerald-500',
    description: 'Start your day with energy! This cardio workout is designed to boost your metabolism and improve cardiovascular health.',
    exercises: [
      { name: 'Warm-up', duration: '5 min', sets: '' },
      { name: 'Jumping Jacks', duration: '3 min', sets: '3 sets' },
      { name: 'High Knees', duration: '3 min', sets: '3 sets' },
      { name: 'Burpees', duration: '4 min', sets: '2 sets' },
      { name: 'Mountain Climbers', duration: '4 min', sets: '3 sets' },
      { name: 'Jump Rope', duration: '5 min', sets: '2 sets' },
      { name: 'Cool Down & Stretch', duration: '6 min', sets: '' },
    ],
  },
  {
    id: '2',
    title: 'Upper Body Power',
    image: 'https://images.unsplash.com/photo-1584827387150-8ae4caebe906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Advanced',
    duration: 45,
    calories: 380,
    difficultyColor: 'bg-orange-500',
    description: 'Build strength and muscle in your chest, back, shoulders, and arms with this comprehensive upper body workout.',
    exercises: [
      { name: 'Warm-up', duration: '5 min', sets: '' },
      { name: 'Push-ups', duration: '5 min', sets: '4 sets of 12-15 reps' },
      { name: 'Dumbbell Rows', duration: '6 min', sets: '4 sets of 10 reps' },
      { name: 'Shoulder Press', duration: '6 min', sets: '4 sets of 10 reps' },
      { name: 'Bicep Curls', duration: '5 min', sets: '3 sets of 12 reps' },
      { name: 'Tricep Dips', duration: '5 min', sets: '3 sets of 12 reps' },
      { name: 'Plank Hold', duration: '3 min', sets: '3 sets of 60 sec' },
      { name: 'Cool Down & Stretch', duration: '10 min', sets: '' },
    ],
  },
  {
    id: '3',
    title: 'Core & Abs Routine',
    image: 'https://images.unsplash.com/photo-1770493895453-4f758c40d11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Intermediate',
    duration: 25,
    calories: 180,
    difficultyColor: 'bg-cyan-500',
    description: 'Strengthen your core muscles and build a solid foundation with this targeted abs and core workout.',
    exercises: [
      { name: 'Warm-up', duration: '3 min', sets: '' },
      { name: 'Crunches', duration: '4 min', sets: '4 sets of 20 reps' },
      { name: 'Russian Twists', duration: '4 min', sets: '3 sets of 30 reps' },
      { name: 'Leg Raises', duration: '4 min', sets: '3 sets of 15 reps' },
      { name: 'Bicycle Crunches', duration: '4 min', sets: '3 sets of 20 reps' },
      { name: 'Plank', duration: '3 min', sets: '3 sets of 60 sec' },
      { name: 'Cool Down & Stretch', duration: '3 min', sets: '' },
    ],
  },
  {
    id: '4',
    title: 'Leg Day Strength',
    image: 'https://images.unsplash.com/photo-1662386392891-688364c5a5d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Advanced',
    duration: 50,
    calories: 420,
    difficultyColor: 'bg-orange-500',
    description: 'Build powerful legs and glutes with this intense lower body strength training session.',
    exercises: [
      { name: 'Warm-up', duration: '5 min', sets: '' },
      { name: 'Squats', duration: '8 min', sets: '4 sets of 12 reps' },
      { name: 'Lunges', duration: '8 min', sets: '4 sets of 10 reps each leg' },
      { name: 'Deadlifts', duration: '8 min', sets: '4 sets of 10 reps' },
      { name: 'Leg Press', duration: '6 min', sets: '3 sets of 15 reps' },
      { name: 'Calf Raises', duration: '5 min', sets: '4 sets of 20 reps' },
      { name: 'Cool Down & Stretch', duration: '10 min', sets: '' },
    ],
  },
  {
    id: '5',
    title: 'HIIT Fat Burner',
    image: 'https://images.unsplash.com/photo-1759300642262-e4517e8db7d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Intermediate',
    duration: 35,
    calories: 340,
    difficultyColor: 'bg-cyan-500',
    description: 'Maximize calorie burn with this high-intensity interval training workout designed for fat loss.',
    exercises: [
      { name: 'Warm-up', duration: '5 min', sets: '' },
      { name: 'Sprint Intervals', duration: '8 min', sets: '30 sec on, 30 sec off' },
      { name: 'Jump Squats', duration: '5 min', sets: '4 sets of 15 reps' },
      { name: 'Box Jumps', duration: '5 min', sets: '4 sets of 12 reps' },
      { name: 'Burpees', duration: '4 min', sets: '3 sets of 10 reps' },
      { name: 'Mountain Climbers', duration: '3 min', sets: '3 sets of 30 sec' },
      { name: 'Cool Down & Stretch', duration: '5 min', sets: '' },
    ],
  },
  {
    id: '6',
    title: 'Yoga Flow Basics',
    image: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    difficulty: 'Beginner',
    duration: 40,
    calories: 150,
    difficultyColor: 'bg-emerald-500',
    description: 'Improve flexibility, balance, and mindfulness with this gentle yoga flow sequence.',
    exercises: [
      { name: 'Breathing & Centering', duration: '5 min', sets: '' },
      { name: 'Sun Salutations', duration: '8 min', sets: '5 rounds' },
      { name: 'Warrior Poses', duration: '8 min', sets: 'Hold each 60 sec' },
      { name: 'Tree Pose', duration: '4 min', sets: 'Hold 60 sec each side' },
      { name: 'Downward Dog', duration: '5 min', sets: '3 rounds of 90 sec' },
      { name: 'Childs Pose & Stretches', duration: '5 min', sets: '' },
      { name: 'Savasana', duration: '5 min', sets: '' },
    ],
  },
];

// orchestrates search, filter, grid, and detail views for the workout section
export default function Workout() {
  const dispatch = useDispatch();
  const reduxFilter = useSelector((state) => state.workout?.activeFilter);
  const [localFilter, setLocalFilter] = useState('All');
  const activeFilter = reduxFilter ?? localFilter;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleFilterChange = (filter) => {
    setLocalFilter(filter);
    dispatch(setFilter(filter));
  };

  const filtered = WORKOUTS.filter((w) => {
    const matchesDifficulty = activeFilter === 'All' || w.difficulty === activeFilter;
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  if (selectedWorkout) {
    return (
      <WorkoutDetails
        workout={selectedWorkout}
        onBack={() => setSelectedWorkout(null)}
      />
    );
  }

  return (
    <div>
      <WorkoutHero />

      <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-20">
        <WorkoutSearch value={searchQuery} onChange={setSearchQuery} />
        <WorkoutFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onClick={setSelectedWorkout}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No workouts found</p>
            <p className="text-sm mt-1">Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
