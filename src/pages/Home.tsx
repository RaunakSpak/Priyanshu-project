import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Navbar } from '../components/Navbar';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <Navbar />
      {/* Decorative background circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            FitVision
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-6">
          AI Powered Personal Fitness Trainer
        </h2>
        
        <p className="max-w-xl text-gray-400 mb-12 text-lg">
          Transform your living room into a smart gym. FitVision uses advanced computer vision to analyze your form in real-time, count your reps, and guide your workout.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/trainer')}
          className="px-8 py-4 bg-primary text-background font-bold text-xl rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-shadow duration-300"
        >
          Start AI Trainer
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
