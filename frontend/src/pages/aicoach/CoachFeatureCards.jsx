import { Clock, Target, Sparkles } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Clock,
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    title: '24/7 Availability',
    description: 'Get instant answers to your fitness questions anytime, anywhere.',
  },
  {
    icon: Target,
    color: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    title: 'Personalized Plans',
    description: 'Receive custom workout and nutrition plans based on your goals.',
  },
  {
    icon: Sparkles,
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
    title: 'Expert Guidance',
    description: 'Backed by fitness science and expert training methodologies.',
  },
];

// three-column informational cards shown below the chat window
export default function CoachFeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {FEATURE_CARDS.map(({ icon: Icon, color, iconColor, title, description }) => (
        <div
          key={title}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div
            className={`w-11 h-11 rounded-full ${color} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h4 className="text-gray-900 font-semibold mb-2 text-sm">{title}</h4>
          <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
      ))}
    </div>
  );
}
