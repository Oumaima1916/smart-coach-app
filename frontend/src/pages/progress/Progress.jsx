import { Dumbbell } from "lucide-react";

const weightData = [180, 178.5, 177.5, 176.5, 174.5, 173, 171, 170];
const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];
const caloriesData = [
  { day: "Mon", burned: 700, consumed: 1900 },
  { day: "Tue", burned: 1050, consumed: 1950 },
  { day: "Wed", burned: 680, consumed: 2300 },
  { day: "Thu", burned: 1100, consumed: 1850 },
  { day: "Fri", burned: 1050, consumed: 2200 },
  { day: "Sat", burned: 1150, consumed: 2400 },
  { day: "Sun", burned: 680, consumed: 1850 },
];
const activeMinutes = [48, 60, 38, 50, 55, 68, 42];
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const workoutHistory = [
  { name: "Full Body Strength", date: "May 9, 2026", duration: "45 min", calories: "380 kcal" },
  { name: "HIIT Cardio", date: "May 8, 2026", duration: "30 min", calories: "320 kcal" },
  { name: "Yoga Flow", date: "May 7, 2026", duration: "40 min", calories: "150 kcal" },
  { name: "Leg Day", date: "May 6, 2026", duration: "50 min", calories: "420 kcal" },
  { name: "Upper Body", date: "May 5, 2026", duration: "45 min", calories: "380 kcal" },
];
const stats = [
  { label: "Total Workouts", value: "156" },
  { label: "Calories Burned", value: "45,230" },
  { label: "Active Days", value: "6/7" },
  { label: "Avg. Duration", value: "48" },
];

const minW = Math.min(...weightData);
const maxW = Math.max(...weightData);
const maxC = Math.max(...caloriesData.map(d => d.consumed));
const maxM = Math.max(...activeMinutes);

export default function Progress() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[320px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=80" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center px-16">
          <div className="text-white max-w-xl space-y-3">
            <h1 className="text-4xl font-bold">Track Your Progress</h1>
            <p className="text-gray-300 text-base leading-relaxed">Monitor your fitness journey with detailed analytics and achievement tracking</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Weight Progress</h3>
            <svg viewBox="0 0 300 150" className="w-full">
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.2"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs>
              {[0,1,2,3].map(i => <line key={i} x1="30" y1={20+i*30} x2="290" y2={20+i*30} stroke="#f0f0f0" strokeWidth="1"/>)}
              {weightData.map((w,i) => {
                const x = 30 + i * (260/7);
                const y = 20 + (maxW - w) / (maxW - minW) * 110;
                return <text key={i} x={x} y="145" textAnchor="middle" fontSize="9" fill="#9ca3af">{weeks[i]}</text>;
              })}
              <polyline fill="url(#wg)" stroke="none" points={weightData.map((w,i) => `${30+i*(260/7)},${20+(maxW-w)/(maxW-minW)*110}`).join(" ") + " 290,130 30,130"} />
              <polyline fill="none" stroke="#22c55e" strokeWidth="2" points={weightData.map((w,i) => `${30+i*(260/7)},${20+(maxW-w)/(maxW-minW)*110}`).join(" ")} />
              {weightData.map((w,i) => <circle key={i} cx={30+i*(260/7)} cy={20+(maxW-w)/(maxW-minW)*110} r="3" fill="#22c55e"/>)}
            </svg>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Calories Overview</h3>
            <div className="flex gap-4 mb-3 text-xs"><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-400 inline-block"/>Burned</span><span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block"/>Consumed</span></div>
            <svg viewBox="0 0 300 150" className="w-full">
              {caloriesData.map((d,i) => {
                const x = 20 + i * 38;
                const bH = (d.burned/maxC)*110;
                const cH = (d.consumed/maxC)*110;
                return (
                  <g key={i}>
                    <rect x={x} y={130-bH} width="14" height={bH} fill="#38bdf8" rx="2"/>
                    <rect x={x+16} y={130-cH} width="14" height={cH} fill="#22c55e" rx="2"/>
                    <text x={x+15} y="145" textAnchor="middle" fontSize="9" fill="#9ca3af">{d.day}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Active Minutes</h3>
            <svg viewBox="0 0 300 150" className="w-full">
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.4"/><stop offset="100%" stopColor="#fb923c" stopOpacity="0"/></linearGradient></defs>
              {activeMinutes.map((_,i) => <text key={i} x={20+i*(260/6)} y="145" textAnchor="middle" fontSize="9" fill="#9ca3af">{days[i]}</text>)}
              <polyline fill="url(#ag)" stroke="none" points={activeMinutes.map((m,i) => `${20+i*(260/6)},${20+(maxM-m)/maxM*110}`).join(" ") + " 280,130 20,130"} />
              <polyline fill="none" stroke="#fb923c" strokeWidth="2" points={activeMinutes.map((m,i) => `${20+i*(260/6)},${20+(maxM-m)/maxM*110}`).join(" ")} />
            </svg>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Workout History</h3>
            <div className="space-y-4">
              {workoutHistory.map((w) => (
                <div key={w.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{w.name}</p>
                    <p className="text-xs text-gray-400">{w.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-800">{w.duration}</p>
                    <p className="text-xs text-gray-400">{w.calories}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
