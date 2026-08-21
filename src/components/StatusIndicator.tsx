import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const isCorrect = status.includes("Correct Form") || !status;
  
  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 flex flex-col gap-2">
      <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={status}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className={`flex items-center gap-3 p-3 rounded-lg ${isCorrect ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
        >
          <span className="text-2xl">{isCorrect ? '✅' : '⚠️'}</span>
          <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
            {status || "Waiting for pose..."}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StatusIndicator;
