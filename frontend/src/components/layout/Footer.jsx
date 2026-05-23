import React from 'react';
import { Link } from 'react-router-dom';

// defined clean layout static navigation links configuration arrays
const NAV_COL_ONE = [
  { to: '/', label: 'Home' },
  { to: '/workout', label: 'Workouts' },
  { to: '/progress', label: 'Progress' },
];

const NAV_COL_TWO = [
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/ai-coach', label: 'AI Coach' },
  { to: '/profile', label: 'Profile' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* brand layout configuration frame panel */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                {/* secure structural svg dumbbell vector element profile shape layout */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6.5 6.5 11 11M3 21l3-3M21 3l-3 3M3 14l7 7M14 3l7 7" />
                </svg>
              </div>
              <span className="font-bold text-xl">Smart Coach</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Your personal AI-powered fitness companion. Transform your health journey with intelligent workout plans, nutrition tracking, and expert guidance.
            </p>
          </div>

          {/* navigation category tree layout menu navigation column */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white/80">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {NAV_COL_ONE.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* features core services internal application link list section */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white/80">
              Features
            </h4>
            <ul className="space-y-3 text-sm">
              {NAV_COL_TWO.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* social dynamic interactive tracking link profiles block */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white/80">
              Connect
            </h4>
            <div className="flex gap-3 mb-6">
              {/* explicit bulletproof manual facebook shape node link anchor icon tag */}
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* explicit bulletproof manual instagram shape node link anchor icon tag */}
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
            </div>
            <p className="text-white/40 text-xs">
              © 2026 Smart Coach. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}