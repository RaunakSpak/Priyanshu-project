import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pose_detector import PoseDetector
from squat_counter import SquatCounter
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
    squat_counter = SquatCounter()
    
    try:
        while True:
            # Receive frame from client (base64)
            data = await websocket.receive_text()
            
            try:
                # Parse the JSON payload if it is JSON, or direct base64
                payload = json.loads(data)
                frame_data = payload.get("frame", "")
            except json.JSONDecodeError:
                frame_data = data
                
            if not frame_data:
                continue
                
            # Convert to image
            img = base64_to_image(frame_data)
            
            # Detect pose
            landmarks, angles = pose_detector.find_pose(img)
            
            if landmarks and angles:
                # Process squat logic
                squat_data = squat_counter.process(
                    angles["left_knee"], 
                    angles["right_knee"],
                    angles["left_hip"],
                    angles["right_hip"]
                )
                
                # Send back the results
                response = {
                    "status": "success",
                    "landmarks": landmarks,
                    "angles": angles,
                    "workout": squat_data
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
