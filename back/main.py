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
from call_runpod import call_comfy_controlnet
import json
import cv2
from PIL import Image
from io import BytesIO
import numpy

cred = credentials.Certificate("./firebase_key.json")
app = initialize_app(cred)
db = firestore.client()

storage_client = storage.Client()
bucket = storage_client.get_bucket("control-meme-public")

# constants
with open('workflows/controlmeme.json') as f:
    controlmeme_workflow = json.load(f)

logo_image = cv2.imread("images/watermark.png", cv2.IMREAD_UNCHANGED)

app = Flask(__name__)
CORS(app)


@app.route("/api/hello/")
def hello_world():
    return "<p>Hello, World!</p>"

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


def add_variation_to_data(generated_image, original_image, prompt):
    formated_timestamp = time.strftime("%Y%m%d-%H%M%S")

    # save generated meme 
    bucket_save_path = "meme_variation_" + formated_timestamp + ".jpeg"
    blob = bucket.blob(bucket_save_path)
    blob.upload_from_file(pil_to_bytes(generated_image), content_type="image/jpeg")
    url_variation = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path

    # save parent image
    parent_save_path = "meme_variation_" + formated_timestamp + "_parent.jpeg"
    blob = bucket.blob(parent_save_path)
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


@app.route("/hint/", methods=["POST"])
def create_hint():
    #TODO
    pass


@app.route("/generate/", methods=["POST"])
def generate():
    #TODO
    pass


@app.route("/save/", methods=["POST"])
def save_variation():
    #TODO
    pass


# route to add a new meme variation to memeID
@app.route("/api/save_variation/", methods=["POST"])
def add_variation():
    """
    Add a new meme variation
    """

    # get post data from post request
    args = request.get_json()
    inputb64 = args.get("imageb64")
    prompt = args.get("prompt")
    
    original_image = Image.open(BytesIO(inputb64))

    comfy_reply = call_comfy_controlnet(inputb64, controlmeme_workflow)

    if not comfy_reply['output']['message']:
        return jsonify({"error": comfy_reply}), 400

    generated_image = Image.open(BytesIO(base64.b64decode(comfy_reply['output']['message'])))

    # overlay_logo uses cv2 image format
    cv2_image = pil_to_cv2(generated_image)
    watermarked = overlay_logo(cv2_image, logo_image)

    # convert final image to PIL 
    final_image = cv2_to_pil(watermarked)

    add_variation_to_data(final_image, original_image, prompt)

    return "success"

if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
