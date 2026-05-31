import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Flame, Footprints, Dumbbell, Heart } from 'lucide-react';
import { getWorkoutSummary } from '../../services/workoutService';

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const firstName = user?.firstName || user?.first_name || 'Coach';

  const [summary, setSummary] = useState({
    totalCalories: 850,
    totalSteps: '8,234',
    totalWorkouts: 12,
    avgDuration: 72,
  });

  useEffect(() => {
    async function loadSummary() {
      if (!token) return;
      try {
        const data = await getWorkoutSummary(token);
        setSummary((prev) => ({
          ...prev,
          totalCalories: data.summary.total_calories || prev.totalCalories,
          totalWorkouts: data.summary.total_workouts || prev.totalWorkouts,
          avgDuration: Math.round(data.summary.avg_duration_sec / 60) || prev.avgDuration,
        }));
      } catch (_) {}
    }
    loadSummary();
  }, [token]);

  const stats = [
    { label: 'Calories Burned', value: summary.totalCalories, unit: 'kcal', change: '+12%', trend: 'up', icon: Flame, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { label: 'Steps Today', value: summary.totalSteps, unit: 'steps', change: '+8%', trend: 'up', icon: Footprints, iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500' },
    { label: 'Workouts', value: summary.totalWorkouts, unit: 'this week', change: '+5%', trend: 'up', icon: Dumbbell, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { label: 'Heart Rate', value: summary.avgDuration, unit: 'bpm', change: '-3%', trend: 'down', icon: Heart, iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[380px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center px-16">
          <div className="text-white max-w-xl space-y-3">
            <h1 className="text-4xl font-bold">Welcome Back, {firstName} 👋</h1>
            <p className="text-gray-300 text-base leading-relaxed">Track your progress, crush your goals, and stay motivated on your fitness journey</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-sm text-gray-400 mt-1">{s.unit}</p>
                    <p className={'text-sm font-semibold mt-3 ' + (s.trend === 'up' ? 'text-green-500' : 'text-red-500')}>{s.change}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                  <div className={'w-12 h-12 rounded-full flex items-center justify-center ' + s.iconBg}>
                    <Icon className={'w-5 h-5 ' + s.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 mb-16">
        <div className="relative rounded-2xl overflow-hidden h-[220px]">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80" alt="Workout" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute top-5 left-6">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Today's Workout</span>
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">Full Body Strength Training</h3>
            <p className="text-gray-300 text-sm mt-1">Build muscle and improve overall strength with this comprehensive full-body workout</p>
          </div>
        </div>
      </div>
    </div>
  );
}