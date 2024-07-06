from PIL import Image
import base64
import requests
from io import BytesIO

# load exemple image in b64
with open("example.jpeg", "rb") as image_file:
    b64_image = base64.b64encode(image_file.read()).decode("utf-8")

seed = 42

prompt = "A cat with a hat"

url = "http://127.0.0.1:5001/control-meme-67c47/us-central1/flaskwrapper/generate/"

data = {
    "imageb64": b64_image,
    "prompt": prompt,
    "seed": seed,
}


res = requests.post(url, json=data)
if res.status_code != 200:
    raise Exception(res.text)
res = res.json()

b64_image = base64.b64decode(res["image"])

image = Image.open(BytesIO(b64_image))

image.save("generated_image.jpeg")

print("Image saved as generated_image.jpeg")
