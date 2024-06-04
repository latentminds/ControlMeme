import requests
import time
import base64
import json
from PIL import Image
from io import BytesIO
import os

# call comfyUI runpod api

def call_comfy_controlnet(b64_input:str, workflow:str) -> str:    
    runpod_api_key = os.environ['RUNPOD_API_KEY']
    runpod_endpoint_id = os.environ['RUNPOD_ENDPOINT_ID']
    
    res = requests.post(
        url = f"https://api.runpod.ai/v2/{runpod_endpoint_id}/runsync",
        headers = {"Authorization": f"Bearer {runpod_api_key}"},
        json={"input": {
            "workflow" : workflow,
            "images" : [
                {
                    "name" : 'example.png',
                     "image" : b64_input
                }
            ]
        }})
    
    return res.json() 
    