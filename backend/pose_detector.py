import cv2
import mediapipe as mp
import numpy as np
from angle_calculator import calculate_angle

class PoseDetector:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    def find_pose(self, img):
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(img_rgb)
        
        landmarks_list = []
        angles = {"left_knee": 0, "right_knee": 0, "left_hip": 0, "right_hip": 0}
        
        if self.results.pose_landmarks:
            landmarks = self.results.pose_landmarks.landmark
            
            # Extract landmarks for JSON
            for idx, lm in enumerate(landmarks):
                landmarks_list.append({
                    "id": idx,
                    "x": lm.x,
                    "y": lm.y,
                    "z": lm.z,
                    "visibility": lm.visibility
                })

            # Get coordinates for angles
            def get_coord(landmark):
                return [landmark.x, landmark.y]

            # Left leg
            l_hip = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value])
            l_knee = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value])
            l_ankle = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value])
            
            # Right leg
            r_hip = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value])
            r_knee = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value])
            r_ankle = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value])

            # Left arm
            l_shoulder = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value])
            l_elbow = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value])
            l_wrist = get_coord(landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value])

            # Right arm
            r_shoulder = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value])
            r_elbow = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value])
            r_wrist = get_coord(landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value])
            
            # Calculate angles
            angles["left_knee"] = int(calculate_angle(l_hip, l_knee, l_ankle))
            angles["right_knee"] = int(calculate_angle(r_hip, r_knee, r_ankle))
            angles["left_hip"] = int(calculate_angle(l_shoulder, l_hip, l_knee))
            angles["right_hip"] = int(calculate_angle(r_shoulder, r_hip, r_knee))
            
            angles["left_elbow"] = int(calculate_angle(l_shoulder, l_elbow, l_wrist))
            angles["right_elbow"] = int(calculate_angle(r_shoulder, r_elbow, r_wrist))
            angles["left_shoulder"] = int(calculate_angle(l_hip, l_shoulder, l_elbow))
            angles["right_shoulder"] = int(calculate_angle(r_hip, r_shoulder, r_elbow))
            
            # Return data
        return landmarks_list, angles
