# controle-meme-back

## Local development
``` bash
pip install -r requirements.txt
flask --debug run --app main
```

## Deploy
``` bash
gcloud app deploy --project controle-meme
```

## API Documentation


@app.route("/api/hello/")
def hello_world():
    return "<p>Hello, World!</p>"

### GET /api/hello/
Test endpoint


### POST /api/save_variation/
Add a new meme variation to memeID
- Required GET params: memeID:str
- REQUIRED POST params: 
    - file:base64str
- Optional POST params:
    - prompt:str
    - controlnetPreprocess:str
    - controlnetModel:str
    - baseModel:str
    - nb steps:int
    - sampler:str
    - seed:int
    - guidance_strenght_prompt:float
    - guidance_strenght_image:float


``` python
from io import BytesIO
import requests

path = "path/to/image.jpg"
prompt = "Exemple prompt"
base_meme_id = "XXXXXXXXX" # Firestore ID of the base meme

im = Image.open(path)

# Save image to BytesIO object and encode to base64
buffered = BytesIO()
im.save(buffered, format="JPEG")
img_str = base64.b64encode(buffered.getvalue())

# Send request
data = dict(
    memeID = base_meme_id,
    imageb64=img_str.decode("utf-8"),
    prompt=prompt
)
requests.post('http://localhost:5000/api/save_variation/', json = data)