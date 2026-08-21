import React, { useEffect, useRef } from 'react';
import type { Landmark } from '../types/pose';

interface PoseOverlayProps {
  landmarks?: Landmark[];
  width?: number;
  height?: number;
}

// MediaPipe connections for drawing the skeleton
const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28], [27, 29], [28, 30], [29, 31],
  [30, 32], [27, 31], [28, 32]
];

const PoseOverlay: React.FC<PoseOverlayProps> = ({ landmarks }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match parent size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // The video is mirrored, so we mirror the coordinates for drawing
    const drawX = (x: number) => canvas.width - (x * canvas.width);
    const drawY = (y: number) => y * canvas.height;

    // Draw lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00E5FF';
    POSE_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      
      if (p1 && p2 && p1.visibility > 0.5 && p2.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(drawX(p1.x), drawY(p1.y));
        ctx.lineTo(drawX(p2.x), drawY(p2.y));
        ctx.stroke();
      }
    });

    // Draw points
    ctx.fillStyle = '#4CAF50';
    landmarks.forEach((lm) => {
      if (lm.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(drawX(lm.x), drawY(lm.y), 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    });

  }, [landmarks]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default PoseOverlay;
