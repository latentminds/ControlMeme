from flask import Flask, request
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
import requests
import time

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def index():
    """
    Generate a meme variation
    POST params: prompt:str, negative_prompt:str, controlnet_hint_url:str, num_inference_steps:int, seed:int
    """
    params = request.get_json()
    
    if 'seed' in params:
      generator = torch.Generator(device="gpu").manual_seed(params["seed"])
    else:
      generator = torch.Generator(device="gpu")
    
    # get controlnet hint image
    controlnet_hint = Image.open(requests.get(params["controlnet_hint_url"], stream=True).raw)
        
    


    image = pipe_canny(prompt=params.get("prompt"), 
                      negative_prompt=params.get("negative_prompt"),
                      controlnet_hint=controlnet_hint,
                      num_inference_steps=params("num_inference_steps"), 
                      generator=generator).images[0]
    
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    
    return base64.b64encode(buffered.getvalue())


def generate_controlnet(params):
    """
    Generate a meme variation
    POST params: prompt:str, negative_prompt:str, controlnet_hint_url:str, num_inference_steps:int, seed:int
    """
    
    if 'seed' in params:
      generator = torch.Generator(device="gpu").manual_seed(params["seed"])
    else:
      generator = torch.Generator(device="gpu")
    
    # get controlnet hint image
    controlnet_hint = Image.open(requests.get(params["controlnet_hint_url"], stream=True).raw)
        
    


    image = pipe_canny(prompt=params.get("prompt"), 
                      negative_prompt=params.get("negative_prompt"),
                      controlnet_hint=controlnet_hint,
                      num_inference_steps=params("num_inference_steps"), 
                      generator=generator).images[0]
    
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    
    return base64.b64encode(buffered.getvalue())

generate_controlnet({"prompt": "test", "negative_prompt": "test", "controlnet_hint_url": "https://storage.googleapis.com/control-meme-public/meme_variation_20210504-160000.png", "num_inference_steps": 100, "seed": 42})