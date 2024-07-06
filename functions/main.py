# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
import runpod_caller
import flask
from flask import request
import time
import dotenv

dotenv.load_dotenv()

initialize_app()
app = flask.Flask(__name__)


@app.post("/generate/")
def generate():
    args = request.get_json()
    b64_input = args.get("imageb64")
    prompt = args.get("prompt")
    seed = args.get("seed", 0)

    image_id = hash(f"{b64_input}{prompt}{seed}{time.time_ns()}")

    generation_workflow = runpod_caller.fill_template(
        "generation", seed=seed, prompt=prompt
    )
    comfy_reply = runpod_caller.comfy_workflow(b64_input, generation_workflow)

    b64_out = comfy_reply["output"]["message"]

    return {"id": image_id, "image": b64_out}


@app.post("/hello/")
def hello():
    return {"message": "Hello from Firebase!"}


@https_fn.on_request()
def flaskwrapper(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()
