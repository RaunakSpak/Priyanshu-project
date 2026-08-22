import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoseDetection } from '../hooks/usePoseDetection';
import AIWebcam from '../components/AIWebcam';
import PoseOverlay from '../components/PoseOverlay';
import WorkoutStats from '../components/WorkoutStats';
import StatusIndicator from '../components/StatusIndicator';
import Timer from '../components/Timer';
import { voiceCoach } from '../components/VoiceCoach';
import { X, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Trainer: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState('squat');
  
  const { 
    poseData, 
    sendFrame, 
    isConnected,
    isCameraReady,
    setIsCameraReady
  } = usePoseDetection();

  const handleStopWorkout = () => {
    setIsActive(false);
    voiceCoach.speak("Workout Completed");
    setTimeout(() => {
      voiceCoach.reset();
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-6 lg:p-8 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">FitVision AI Trainer</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              )}
            </span>
            <span className="text-sm text-gray-400">
              {isConnected ? 'AI Active' : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Video Feed */}
        <div className="lg:col-span-2 relative flex flex-col">
          <div className="relative flex-1 bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Webcam & Overlay */}
            <AIWebcam 
              isActive={isActive} 
              onFrame={(frame) => sendFrame(frame, selectedExercise)} 
              onReady={() => setIsCameraReady(true)}
            />
            {isCameraReady && <PoseOverlay landmarks={poseData?.landmarks} />}
          </div>
        </div>

        {/* Right Column: Stats Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-800/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 shadow-lg">
            <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Select Exercise</label>
            <select 
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:border-primary"
            >
              <option value="squat">Squat</option>
              <option value="bicep_curl">Bicep Curl</option>
              <option value="pushup">Pushup</option>
            </select>
          </div>

          <WorkoutStats workout={poseData?.workout} angles={poseData?.angles} exercise={selectedExercise} />
          
          <Timer />
          
          <StatusIndicator status={poseData?.workout?.feedback || ""} />
          
          <div className="flex-1" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStopWorkout}
            className="w-full py-4 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
            Stop Workout
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Trainer;
