"""
Flask app to serve the meme generator

"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
import time
import os
import base64
from add_signature import overlay_logo
from runpod_caller import comfy_workflow, fill_template
import json
import cv2
from PIL import Image
from io import BytesIO
import numpy

cred = credentials.Certificate("./firebase_key.json")
app = initialize_app(cred)
db = firestore.client()

storage_client = storage.Client()
public_bucket = storage_client.get_bucket("control-meme-public")
private_bucket = storage_client.get_bucket("control-meme-private")

# constants
with open('workflows/hint.json') as f:
    hint_workflow = json.load(f)

logo_image = cv2.imread("images/watermark.png", cv2.IMREAD_UNCHANGED)

app = Flask(__name__)
CORS(app)

def pil_to_cv2(pil_image):
    image = pil_image.convert('RGB')
    open_cv_image = numpy.array(image)
    open_cv_image = open_cv_image[:, :, ::-1].copy()
    return open_cv_image


def cv2_to_pil(cv2_image):
    cv2_img = cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(cv2_img)
    return pil_image


def pil_to_bytes(pil_image, format='JPEG'):
    image_byte_array = BytesIO()
    pil_image.save(image_byte_array, format=format)
    image_byte_array.seek(0)
    return image_byte_array


def save_variation_to_base(generated_image, original_image, prompt):
    formated_timestamp = time.strftime("%Y%m%d-%H%M%S")

    # save generated meme 
    bucket_save_path = "meme_variation_" + formated_timestamp + ".jpeg"
    blob = public_bucket.blob(bucket_save_path)
    blob.upload_from_file(pil_to_bytes(generated_image), content_type="image/jpeg")
    url_variation = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path

    # save parent image
    parent_save_path = "meme_variation_" + formated_timestamp + "_parent.jpeg"
    blob = public_bucket.blob(parent_save_path)
    blob.upload_from_file(pil_to_bytes(original_image), content_type="image/jpeg")
    url_parent = "https://storage.googleapis.com/control-meme-public/" + parent_save_path

    variation_data = {
        "url": url_variation,
        "parent_url": url_parent,
        "prompt": prompt,
        "timestamp": firestore.SERVER_TIMESTAMP,
    }

    db = firestore.client()

    # save meme variation to firestore in the Variations collection with parent memeID in attribute parent_uuid
    doc_ref = db.collection("Variations").document()
    doc_ref.set(variation_data)


@app.get("/hello/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.post("/hint/")
def create_hint():
    #TODO
    pass


@app.post("/generate/")
def generate():
    args = request.get_json()
    b64_input = args.get("imageb64")
    prompt = args.get("prompt")
    seed = args.get("seed")

    image_id = hash(f"{b64_input}{prompt}{seed}")
    
    generation_workflow = fill_template("generation", seed=seed, prompt=prompt)
    comfy_reply = comfy_workflow(b64_input, generation_workflow)

    # return 400 if there is an error with comfy
    if not comfy_reply['output']['message']:
        return jsonify({"error": comfy_reply}), 400
    
    b64_image = base64.b64decode(comfy_reply['output']['message'])
    
    # store the generation in the private bucket in base with image_id
    image_blob = private_bucket.blob("meme_variation_" + image_id + ".jpeg")
    image_blob.upload_from_file(BytesIO(b64_image), content_type="image/jpeg")

    parent_blob = private_bucket.blob("meme_variation_" + image_id + "_parent.jpeg")
    parent_blob.upload_from_file(BytesIO(b64_input), content_type="image/jpeg")

    # creating the answer dict
    answer = {
        "id": image_id,
        "image": b64_image
    }

    return answer


@app.post("/save/")
def save_variation():
    args = request.get_json()
    image_id = args.get("image_id")
    prompt = args.get("prompt")

    # move from private bucket to public bucket using image_id
    image_name = "meme_variation_" + image_id + ".jpeg"
    image_blob = private_bucket.blob(image_name)
    private_bucket.copy_blob(image_blob, public_bucket, image_name)

    parent_name = "meme_variation_" + image_id + "_parent.jpeg"
    parent_blob = private_bucket.blob(parent_name)
    private_bucket.copy_blob(parent_blob, public_bucket, parent_name)

    # add line for this variation in firebase 
    db = firestore.client()
    doc_ref = db.collection("Variations").document()

    variation_data = {
        "url": "https://storage.googleapis.com/control-meme-public/" + image_name,
        "parent_url": "https://storage.googleapis.com/control-meme-public/" + parent_name,
        "prompt": prompt,
        "timestamp": firestore.SERVER_TIMESTAMP,
    }

    doc_ref.set(variation_data)

    return 200


## route to add a new meme variation to memeID
#@app.post("/save_variation/")
#def add_variation():
#    """
#    Add a new meme variation
#    """
#
#    # get post data from post request
#    args = request.get_json()
#    b64_input = args.get("imageb64")
#    prompt = args.get("prompt")
#    
#    original_image = Image.open(BytesIO(b64_input))
#
#    comfy_reply = comfy_workflow(b64_input, generation_workflow)
#
#    if not comfy_reply['output']['message']:
#        return jsonify({"error": comfy_reply}), 400
#
#    generated_image = Image.open(BytesIO(base64.b64decode(comfy_reply['output']['message'])))
#
#    # overlay_logo uses cv2 image format
#    cv2_image = pil_to_cv2(generated_image)
#    watermarked = overlay_logo(cv2_image, logo_image)
#
#    # convert final image to PIL 
#    final_image = cv2_to_pil(watermarked)
#
#    save_variation_to_base(final_image, original_image, prompt)
#
#    return "success"


if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
