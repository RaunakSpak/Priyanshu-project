import cv2
import base64
import numpy as np

def base64_to_image(base64_string):
    # Remove header if present
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]
    
    img_data = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img
