class SquatCounter:
    def __init__(self):
        self.counter = 0
        self.stage = None # "down" or "up"
        self.feedback = "✅ Correct Form"
        self.calories_per_rep = 0.5
    
    def process(self, left_knee, right_knee, left_hip, right_hip):
        # Use the minimum angle if both are valid, otherwise average. 
        # (A smaller angle means a deeper squat, so min is safer for side profiles)
        valid_knees = [k for k in (left_knee, right_knee) if k > 10]
        if valid_knees:
            check_angle = min(valid_knees)
        else:
            check_angle = 180
            
        # Simple threshold-based logic
        # If standing (angle > 140)
        if check_angle > 140:
            if self.stage == "down":
                self.counter += 1
                self.feedback = "✅ Correct Form"
            self.stage = "up"
        
        # If going down (angle < 110)
        if check_angle < 110:
            if self.stage == "up":
                self.feedback = "✅ Correct Form"
            self.stage = "down"
            
        # Posture feedback when going down but not low enough
        if self.stage == "up" and 110 <= check_angle <= 130:
            self.feedback = "⚠ Go Lower"
            
        # Can add back straightness logic using hip and shoulder angles if needed
        # For this module, we keep it simple as requested based on knee angles.
        
        return {
            "reps": self.counter,
            "feedback": self.feedback,
            "calories": self.counter * self.calories_per_rep
        }
