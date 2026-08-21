class SquatCounter:
    def __init__(self):
        self.counter = 0
        self.stage = None # "down" or "up"
        self.feedback = "✅ Correct Form"
        self.calories_per_rep = 0.5
    
    def process(self, left_knee, right_knee, left_hip, right_hip):
        # Calculate average knee angle for simplicity, or check both
        avg_knee = (left_knee + right_knee) / 2.0
        
        # Simple threshold-based logic
        # If standing (angle > 160)
        if avg_knee > 160:
            if self.stage == "down":
                self.counter += 1
                self.feedback = "✅ Correct Form"
            self.stage = "up"
        
        # If going down (angle < 90)
        if avg_knee < 90:
            if self.stage == "up":
                self.feedback = "✅ Correct Form"
            self.stage = "down"
            
        # Posture feedback when going down but not low enough
        if self.stage == "up" and 100 < avg_knee < 150:
            self.feedback = "⚠ Go Lower"
            
        # Can add back straightness logic using hip and shoulder angles if needed
        # For this module, we keep it simple as requested based on knee angles.
        
        return {
            "reps": self.counter,
            "feedback": self.feedback,
            "calories": self.counter * self.calories_per_rep
        }
