import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" />
        <p className="text-gray-400 text-sm uppercase tracking-wider">Workout Time</p>
      </div>
      <p className="text-2xl font-bold font-mono text-white tracking-widest">{formatTime(seconds)}</p>
    </div>
  );
};

export default Timer;
