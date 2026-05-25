import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Clock, Flame, Play, Pause, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react';
import {
  startWorkout,
  pauseWorkout,
  resumeWorkout,
  finishWorkout,
  clearSession,
  clearSessionError,
} from '../../store/workoutSlice';

export default function WorkoutDetails({ workout, onBack }) {
  const dispatch = useDispatch();

  const { session, sessionLoading, sessionError, completedSession } = useSelector(
    (s) => s.workout
  );

  // ── LIVE LIFECYCLE STATES ──────────────────────────────────────────────────
  const [globalSeconds, setGlobalSeconds] = useState(0); // overall session timer
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // active exercise index
  const [exerciseSeconds, setExerciseSeconds] = useState(0); // current exercise timer
  const [completedExercises, setCompletedExercises] = useState({}); // tracks finished exercises

  const isActive = session?.status === 'active';
  const isPaused = session?.status === 'paused';
  const isRunning = isActive || isPaused;

  const currentExercise = workout.exercises[currentExerciseIndex];
  
  // convert strings like "5 min" or "45 sec" into total seconds
  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 60; // default to 1 min if missing
    const num = parseInt(durationStr);
    if (durationStr.toLowerCase().includes('min')) return num * 60;
    return num;
  };

  const currentExerciseTargetSeconds = parseDurationToSeconds(currentExercise?.duration);

  // ── TIMERS EFFECT ──────────────────────────────────────────────────────────
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        // 1. increment overall workout time
        setGlobalSeconds((prev) => prev + 1);
        
        // 2. increment current exercise time
        setExerciseSeconds((prev) => {
          const nextSeconds = prev + 1;
          
          // auto mark as done if user hits the target duration
          if (nextSeconds >= currentExerciseTargetSeconds) {
            setCompletedExercises((old) => ({ ...old, [currentExerciseIndex]: true }));
          }
          return nextSeconds;
        });
      }, 1000);
    } else if (!isRunning) {
      // reset everything if session is cleared or finished
      setGlobalSeconds(0);
      setExerciseSeconds(0);
      setCurrentExerciseIndex(0);
      setCompletedExercises({});
    }

    return () => clearInterval(interval);
  }, [isActive, isRunning, currentExerciseIndex, currentExerciseTargetSeconds]);

  // cleanup state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSession());
    };
  }, [dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleStart = () => {
    dispatch(startWorkout({ planTitle: workout.title }));
  };

  const handleNextExercise = () => {
    // mark current exercise checkmark as green
    setCompletedExercises((old) => ({ ...old, [currentExerciseIndex]: true }));
    
    // move to next exercise if available
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setExerciseSeconds(0); // reset exercise timer for the next one
    }
  };

  // helper to format seconds into 00:00 structure
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // circular progress calculations
  const percentage = Math.min((exerciseSeconds / currentExerciseTargetSeconds) * 100, 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div>
      {/* Slim Hero */}
      <div className="relative w-full h-52 overflow-hidden">
        <img src={workout.image} alt={workout.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1200px] mx-auto px-8 w-full">
            <h1 className="text-white text-3xl font-semibold mb-2">{workout.title}</h1>
            <p className="text-white/85 text-base">{workout.difficulty} · {workout.duration} min</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pb-16">
        {/* Back Nav */}
        <button
          onClick={() => { dispatch(clearSession()); onBack(); }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 mt-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workouts
        </button>

        {sessionError && (
          <div className="mb-6 px-5 py-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
            <span>{sessionError}</span>
            <button onClick={() => dispatch(clearSessionError())} className="text-red-400 hover:text-red-600 font-semibold">✕</button>
          </div>
        )}

        {completedSession && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <h3 className="text-emerald-800 font-semibold text-lg">Workout Complete!</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-700">{Math.round(completedSession.activeDurationSec / 60)} min</p>
                <p className="text-emerald-600 text-xs mt-1">Active Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{completedSession.caloriesBurned}</p>
                <p className="text-emerald-600 text-xs mt-1">Calories Burned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{Math.round(completedSession.totalPausedSec / 60)} min</p>
                <p className="text-emerald-600 text-xs mt-1">Paused</p>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE INTERACTIVE WORKOUT PANEL ─────────────────────────────────────── */}
        {isRunning && currentExercise && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl mb-8 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* live progress circle */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r={radius} className="text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" />
                  <circle cx="56" cy="56" r={radius} className="text-emerald-400 transition-all duration-1000" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <div className="absolute font-mono text-xl font-bold text-emerald-400">
                  {formatTime(exerciseSeconds)}
                </div >
              </div>

              <div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Current Exercise ({currentExerciseIndex + 1}/{workout.exercises.length})
                </span>
                <h2 className="text-2xl font-bold mt-2 text-white">{currentExercise.name}</h2>
                <p className="text-slate-400 text-sm mt-1">Target: {currentExercise.duration} {currentExercise.sets ? `· ${currentExercise.sets}` : ''}</p>
              </div>
            </div>

            {/* next button or end state indicator */}
            <div className="flex items-center gap-4">
              {currentExerciseIndex < workout.exercises.length - 1 ? (
                <button
                  onClick={handleNextExercise}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-md ${
                    exerciseSeconds >= currentExerciseTargetSeconds
                      ? 'bg-emerald-50 text-white hover:bg-emerald-600 animate-bounce'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Next Exercise <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  🎉 Last Exercise!
                </span>
              )}
              
              <div className="text-right border-l border-slate-700 pl-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Time</p>
                <p className="text-xl font-mono font-bold text-white mt-0.5">{formatTime(globalSeconds)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Static Details Layout */}
        {!isRunning && !completedSession && (
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-8">
            <div className="relative h-96">
              <img src={workout.image} alt={workout.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className={`inline-block px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-4 ${workout.difficultyColor}`}>{workout.difficulty}</span>
                <h2 className="text-white text-3xl font-semibold mb-3">{workout.title}</h2>
                <p className="text-white/85 mb-6 max-w-2xl text-sm leading-relaxed">{workout.description}</p>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"><Clock className="w-5 h-5 text-white" /></div>
                    <div><p className="text-white font-medium">{workout.duration} min</p><p className="text-white/65 text-xs">Duration</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"><Flame className="w-5 h-5 text-white" /></div>
                    <div><p className="text-white font-medium">{workout.calories} kcal</p><p className="text-white/65 text-xs">Calories</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Breakdown List */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-10">
          <h2 className="text-gray-900 text-xl font-semibold mb-6">Exercise Breakdown</h2>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => {
              const isComp = completedExercises[index];
              const isCurrent = isRunning && index === currentExerciseIndex;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-slate-800 text-white shadow-md ring-2 ring-emerald-400 scale-[1.01]' 
                      : isComp 
                        ? 'bg-emerald-50 border border-emerald-100' 
                        : 'bg-gray-50 hover:bg-emerald-50 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      isComp 
                        ? 'bg-emerald-500 text-white' 
                        : isCurrent 
                          ? 'bg-emerald-400 text-slate-900' 
                          : 'bg-gray-200 text-gray-700'
                    }`}>
                      {isComp ? '✓' : index + 1}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isCurrent ? 'text-white' : isComp ? 'text-emerald-900 line-through opacity-75' : 'text-gray-900'}`}>
                        {exercise.name}
                      </p>
                      {exercise.sets && (
                        <p className={`text-xs mt-0.5 ${isCurrent ? 'text-emerald-300' : 'text-gray-500'}`}>{exercise.sets}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm ${isCurrent ? 'text-emerald-400 font-mono font-bold' : 'text-gray-500'}`}>
                    {isCurrent ? formatTime(exerciseSeconds) + ' / ' + exercise.duration : exercise.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SESSION CONTROL BUTTONS ────────────────────────────────────────────── */}
        <div className="flex justify-center gap-4 flex-wrap">
          {!isRunning && !completedSession && (
            <button
              onClick={handleStart}
              disabled={sessionLoading}
              className="flex items-center gap-3 px-12 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl font-semibold text-base disabled:opacity-60"
            >
              <Play className="w-5 h-5 fill-white" /> {sessionLoading ? 'Starting…' : 'Start Workout'}
            </button>
          )}

          {isActive && (
            <>
              <button onClick={() => dispatch(pauseWorkout(session.logId))} className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition-all shadow-lg font-semibold text-base">
                <Pause className="w-5 h-5 fill-white" /> Pause
              </button>
              <button onClick={() => dispatch(finishWorkout(session.logId))} disabled={sessionLoading} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg font-semibold text-base disabled:opacity-60">
                <CheckCircle className="w-5 h-5" /> {sessionLoading ? 'Finishing…' : 'Finish Workout'}
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button onClick={() => dispatch(resumeWorkout(session.logId))} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg font-semibold text-base">
                <RotateCcw className="w-5 h-5" /> Resume
              </button>
              <button onClick={() => dispatch(finishWorkout(session.logId))} disabled={sessionLoading} className="flex items-center gap-3 px-8 py-4 bg-gray-700 text-white rounded-2xl hover:bg-gray-800 transition-all shadow-lg font-semibold text-base disabled:opacity-60">
                <CheckCircle className="w-5 h-5" /> {sessionLoading ? 'Finishing…' : 'Finish Anyway'}
              </button>
            </>
          )}

          {completedSession && (
            <button onClick={() => { dispatch(clearSession()); onBack(); }} className="flex items-center gap-3 px-12 py-4 bg-gray-700 text-white rounded-2xl hover:bg-gray-800 transition-all shadow-lg font-semibold text-base">
              <ArrowLeft className="w-5 h-5" /> Back to Workouts
            </button>
          )}
        </div>
      </div>
    </div>
  );
}