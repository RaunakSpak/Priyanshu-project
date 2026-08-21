import React from 'react';
import type { Angles, WorkoutData } from '../types/pose';
import { Activity, Flame } from 'lucide-react';

interface WorkoutStatsProps {
  workout?: WorkoutData;
  angles?: Angles;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workout, angles }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Reps */}
      <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl border border-gray-700 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Exercise</p>
          <p className="text-xl font-bold text-white">Squat</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Reps</p>
          <p className="text-4xl font-extrabold text-primary">{workout?.reps || 0}</p>
        </div>
      </div>

      {/* Angles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Left Knee</p>
          <p className="text-2xl font-bold text-white">{angles?.left_knee || 0}°</p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Right Knee</p>
          <p className="text-2xl font-bold text-white">{angles?.right_knee || 0}°</p>
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
