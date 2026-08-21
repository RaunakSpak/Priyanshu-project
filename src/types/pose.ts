export interface Landmark {
  id: number;
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface Angles {
  left_knee: number;
  right_knee: number;
  left_hip: number;
  right_hip: number;
}

export interface WorkoutData {
  reps: number;
  feedback: string;
  calories: number;
}

export interface PoseData {
  status: string;
  landmarks?: Landmark[];
  angles?: Angles;
  workout?: WorkoutData;
}
