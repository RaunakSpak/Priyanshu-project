import React, { useRef, useEffect, useState } from 'react';

interface AIWebcamProps {
  onFrame: (base64Frame: string) => void;
  onReady: () => void;
  isActive: boolean;
}

const AIWebcam: React.FC<AIWebcamProps> = ({ onFrame, onReady, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err: any) {
        console.error("Error accessing webcam:", err);
        setErrorMsg(err.message || "Failed to start camera. Is it being used by another app?");
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  const captureFrame = () => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video.readyState >= 4 && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64, scale down quality for performance if needed
      const base64Frame = canvas.toDataURL('image/jpeg', 0.5);
      onFrame(base64Frame);
    }
    
    // Throttle slightly to achieve ~30fps
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(captureFrame);
    }, 33);
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
      {errorMsg ? (
        <div className="text-center p-6 bg-red-900/30 rounded-lg border border-red-500/50 max-w-md">
          <p className="text-red-400 font-bold mb-2">Camera Error</p>
          <p className="text-gray-300 text-sm">{errorMsg}</p>
          <p className="text-gray-400 text-xs mt-4">Please ensure your camera is not being used by Zoom/OBS, and that you have granted browser permissions.</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover mirror"
          playsInline
          muted
          onLoadedData={() => {
            onReady();
            captureFrame();
          }}
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      {/* Hidden canvas for extracting frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AIWebcam;
