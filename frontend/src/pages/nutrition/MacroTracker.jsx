import { Flame, Droplet, Wheat } from 'lucide-react';

const STATS = [
  {
    value: '2,150',
    unit: 'kcal',
    label: 'Total Calories',
    icon: Flame,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    value: '2.4L',
    unit: 'of 3L',
    label: 'Water Intake',
    icon: Droplet,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  {
    value: '145g',
    unit: 'of 180g',
    label: 'Carbs Target',
    icon: Wheat,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
];

// displays daily macro and hydration summary cards
export default function MacroTracker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {STATS.map(({ value, unit, label, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-3xl font-semibold text-gray-900">{value}</p>
              <p className="text-gray-400 text-sm">{unit}</p>
            </div>
            <div
              className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">{label}</p>
        </div>
      ))}
    </div>
  );
}
