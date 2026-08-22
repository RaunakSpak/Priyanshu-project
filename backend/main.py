import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pose_detector import PoseDetector
from squat_counter import SquatCounter
from bicep_counter import BicepCounter
from pushup_counter import PushupCounter
from image_utils import base64_to_image
from database import engine, Base
from routes import auth

# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="FitVision AI Trainer Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FitVision AI Trainer API is running"}

app.include_router(auth.router)

@app.websocket("/ws/trainer")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    pose_detector = PoseDetector()
    counters = {
        "squat": SquatCounter(),
        "bicep_curl": BicepCounter(),
        "pushup": PushupCounter()
    }
    
    try:
        while True:
            # Receive frame from client (base64)
            data = await websocket.receive_text()
            
            try:
                # Parse the JSON payload if it is JSON, or direct base64
                payload = json.loads(data)
                frame_data = payload.get("frame", "")
                exercise_type = payload.get("exercise", "squat")
            except json.JSONDecodeError:
                frame_data = data
                exercise_type = "squat"
                
            if not frame_data:
                continue
                
            # Convert to image
            img = base64_to_image(frame_data)
            
            # Detect pose
            landmarks, angles = pose_detector.find_pose(img)
            
            if landmarks and angles:
                workout_data = None
                
                # Process logic based on exercise
                if exercise_type == "bicep_curl":
                    workout_data = counters["bicep_curl"].process(
                        angles.get("left_elbow", 0),
                        angles.get("right_elbow", 0)
                    )
                elif exercise_type == "pushup":
                    workout_data = counters["pushup"].process(
                        angles.get("left_elbow", 0),
                        angles.get("right_elbow", 0),
                        angles.get("left_shoulder", 0),
                        angles.get("right_shoulder", 0)
                    )
                else: # Default to squat
                    workout_data = counters["squat"].process(
                        angles.get("left_knee", 0), 
                        angles.get("right_knee", 0),
                        angles.get("left_hip", 0),
                        angles.get("right_hip", 0)
                    )
                
                # Send back the results
                response = {
                    "status": "success",
                    "landmarks": landmarks,
                    "angles": angles,
                    "workout": workout_data
                }
            else:
                response = {
                    "status": "no_pose"
                }
                
            await websocket.send_json(response)
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
