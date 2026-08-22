class BicepCounter:
    def __init__(self):
        self.counter = 0
        self.stage = None # "down" or "up"
        self.feedback = "✅ Correct Form"
        self.calories_per_rep = 0.2
    
    def process(self, left_elbow, right_elbow):
        valid_elbows = [e for e in (left_elbow, right_elbow) if e > 10]
        if valid_elbows:
            check_angle = min(valid_elbows) # The arm that is curling most
        else:
            check_angle = 180
            
        # Arm extended (down)
        if check_angle > 135:
            if self.stage == "up":
                self.counter += 1
                self.feedback = "✅ Correct Form"
            self.stage = "down"
        
        # Arm curled (up)
        if check_angle < 75:
            if self.stage == "down":
                self.feedback = "✅ Correct Form"
            self.stage = "up"
            
        # Posture feedback when going up but not fully curled
        if self.stage == "down" and 75 <= check_angle <= 110:
            self.feedback = "⚠ Curl Higher"
            
        return {
            "reps": self.counter,
            "feedback": self.feedback,
            "calories": self.counter * self.calories_per_rep
        }
