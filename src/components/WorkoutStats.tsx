import React from 'react';
import type { Angles, WorkoutData } from '../types/pose';
import { Activity, Flame } from 'lucide-react';

interface WorkoutStatsProps {
  workout?: WorkoutData;
  angles?: Angles;
  exercise?: string;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workout, angles, exercise = 'squat' }) => {
  const exerciseNames: Record<string, string> = {
    'squat': 'Squat',
    'bicep_curl': 'Bicep Curl',
    'pushup': 'Pushup'
  };

  const getAnglesToDisplay = () => {
    switch (exercise) {
      case 'bicep_curl':
      case 'pushup':
        return {
          leftLabel: 'Left Elbow',
          rightLabel: 'Right Elbow',
          leftVal: angles?.left_elbow || 0,
          rightVal: angles?.right_elbow || 0
        };
      case 'squat':
      default:
        return {
          leftLabel: 'Left Knee',
          rightLabel: 'Right Knee',
          leftVal: angles?.left_knee || 0,
          rightVal: angles?.right_knee || 0
        };
    }
  };

  const displayAngles = getAnglesToDisplay();

  return (
    <div className="flex flex-col gap-4">
      {/* Reps */}
      <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl border border-gray-700 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Exercise</p>
          <p className="text-xl font-bold text-white">{exerciseNames[exercise] || 'Squat'}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Reps</p>
          <p className="text-4xl font-extrabold text-primary">{workout?.reps || 0}</p>
        </div>
      </div>

      {/* Angles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{displayAngles.leftLabel}</p>
          <p className="text-2xl font-bold text-white">{displayAngles.leftVal}°</p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{displayAngles.rightLabel}</p>
          <p className="text-2xl font-bold text-white">{displayAngles.rightVal}°</p>
        </div>
      </div>

      {/* Calories */}
      <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 flex items-center gap-4">
        <div className="p-3 bg-red-500/20 rounded-full">
          <Flame className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">Calories Burned</p>
          <p className="text-xl font-bold text-white">{workout?.calories || 0} kcal</p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;
