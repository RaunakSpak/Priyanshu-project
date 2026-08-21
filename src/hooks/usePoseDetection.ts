import { useState, useCallback, useRef, useEffect } from 'react';
import type { PoseData } from '../types/pose';
import { voiceCoach } from '../components/VoiceCoach';

const WS_URL = 'ws://127.0.0.1:8000/ws/trainer';

export const usePoseDetection = () => {
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to AI Backend');
      setIsConnected(true);
      voiceCoach.speak("Workout Started");
    };

    ws.onmessage = (event) => {
      try {
        const data: PoseData = JSON.parse(event.data);
        setPoseData(data);
        
        if (data.workout?.feedback) {
          voiceCoach.speak(data.workout.feedback);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from AI Backend');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendFrame = useCallback((base64Frame: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ frame: base64Frame }));
    }
  }, []);

  return {
    poseData,
    sendFrame,
    isConnected,
    canvasRef,
    isCameraReady,
    setIsCameraReady
  };
};
