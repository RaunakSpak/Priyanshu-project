class PushupCounter:
    def __init__(self):
        self.counter = 0
        self.stage = None # "down" or "up"
        self.feedback = "✅ Correct Form"
        self.calories_per_rep = 0.8
    
    def process(self, left_elbow, right_elbow, left_shoulder, right_shoulder):
        valid_elbows = [e for e in (left_elbow, right_elbow) if e > 10]
        if valid_elbows:
            check_angle = min(valid_elbows)
        else:
            check_angle = 180
            
        # Body in up position (arms extended)
        if check_angle > 140:
            if self.stage == "down":
                self.counter += 1
                self.feedback = "✅ Correct Form"
            self.stage = "up"
        
        # Body lowered
        if check_angle < 100:
            if self.stage == "up":
                self.feedback = "✅ Correct Form"
            self.stage = "down"
            
        # Feedback if not going low enough
        if self.stage == "up" and 100 <= check_angle <= 130:
            self.feedback = "⚠ Go Lower"
            
        return {
            "reps": self.counter,
            "feedback": self.feedback,
            "calories": self.counter * self.calories_per_rep
        }
