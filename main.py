"""
Flask app to serve the meme generator

"""

from flask import Flask, request
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
import requests
import time
import random
import os
import base64

print(os.getcwd())
# print files in current directory
print(list(os.listdir()))


cred = credentials.Certificate("./firebase_key.json")
app = initialize_app(cred)
db = firestore.client()

storage_client = storage.Client()
bucket = storage_client.get_bucket("control-meme-public")

app = Flask(__name__)
CORS(app)


@app.route("/api/hello/")
def hello_world():
    return "<p>Hello, World!</p>"



def add_variation_to_data(image_path_local, parent_uuid, **kwargs):
    
    # get kwargs
    prompt = kwargs.get("prompt")
    controlnetPreprocess = kwargs.get("controlnetPreprocess")
    controlnetModel = kwargs.get("controlnetModel")
    baseModel = kwargs.get("baseModel")
    nb_steps = kwargs.get("nb_steps")
    sampler = kwargs.get("sampler")
    seed = kwargs.get("seed")
    guidance_strenght_prompt = kwargs.get("guidance_strenght_prompt")
    guidance_strenght_image = kwargs.get("guidance_strenght_image")
    
    # save meme variation to bucket
    
    formated_timestamp = time.strftime("%Y%m%d-%H%M%S")
    bucket_save_path = "meme_variation_" + formated_timestamp + ".jpeg"
    blob = bucket.blob(bucket_save_path)
    blob.upload_from_filename(image_path_local, content_type="image/jpeg")
    url = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path

    variation_data = {
            "url": url,
            "prompt": prompt,
            "controlnetPreprocess": controlnetPreprocess,
            "controlnetModel": controlnetModel,
            "baseModel": baseModel,
            "nb_steps": nb_steps,
            "sampler": sampler,
            "seed": seed,
            "guidance_strenght_prompt": guidance_strenght_prompt,
            "guidance_strenght_image": guidance_strenght_image,
            "timestamp": firestore.SERVER_TIMESTAMP, # type: ignore
            "parent_uuid": parent_uuid
        }
    
    db = firestore.client()    
    # save meme variation to firestore in the Variations collection with parent memeID in attribute parent_uuid
    doc_ref = db.collection("Variations").document()
    doc_ref.set(variation_data)
    
    # save meme variation to firestore as a child of the meme with id memeID
    doc_ref = db.collection("BaseMemes").document(parent_uuid).collection("Variations").document()
    doc_ref.set(variation_data)
    
    


#route to add a new meme variation to memeID
@app.route("/api/save_variation/", methods=["POST"])
def add_variation():
    """
    Add a new meme variation to memeID
    params get: memeID:str
    params post: file:base64str, prompt:str, controlnetPreprocess:str, controlnetModel:str, baseModel:str, nb steps:int, sampler:str, seed:int, guidance_strenght_prompt:float, guidance_strenght_image:float
    """
    print('called')
    # get post data from post request
    args = request.get_json()
    print('oups')
    memeID = args.get("memeID")
    fileb64 = args.get("imageb64")
    prompt = args.get("prompt")
    controlnetPreprocess = args.get("controlnetPreprocess")
    controlnetModel = args.get("controlnetModel")
    baseModel = args.get("baseModel")
    nb_steps = args.get("nb_steps")
    sampler = args.get("sampler")
    seed = args.get("seed")
    guidance_strenght_prompt = args.get("guidance_strenght_prompt")
    guidance_strenght_image = args.get("guidance_strenght_image")
    print('here')
    # Todo add image fast validation
    random_name = str(random.randint(0, 10000))
    #save to jpeg
    path = f"./{random_name}.jpeg"
    with open(path, 'wb') as f:
        f.write(base64.b64decode(fileb64))


    add_variation_to_data(path, memeID, 
                          prompt=prompt, 
                          controlnetPreprocess=controlnetPreprocess, 
                          controlnetModel=controlnetModel, 
                          baseModel=baseModel, 
                          nb_steps=nb_steps, 
                          sampler=sampler, 
                          seed=seed, 
                          guidance_strenght_prompt=guidance_strenght_prompt, 
                          guidance_strenght_image=guidance_strenght_image)
    
    os.remove(path)
    
    # save base64 image to storage
    
    return "success"
# call example with requests and params as form data

    




# # route to generate meme
# @app.route("/api/generate/", methods=["POST"])
# def generate_meme():
#     """
#     Save base64 image to storage
#     Save entry to firestore
#     Send a POST request to colabLink with base64 image and args as post data
#     params get: colabLink:str, baseImageOrigin:str
#     params post: base_image: str base64,  args: dict
#     args: prompt:str, controlnetPreprocess:str, controlnetModel:str 
#     """
    
#     # get post data from form
#     base_image = request.form.get("file")
#     args = request.form.get("args")
#     base_image_origin = request.form.get("base_image_origin")
#     # get colab link
#     colabLink = request.args.get("colabLink")
#     # save base64 image to storage if base_image_origin is not "storage"
#     if base_image_origin == "upload":
#         formated_timestamp = time.strftime("%Y%m%d-%H%M%S")
#         bucket_save_path = "base_image_" + formated_timestamp + ".png"
#         blob = bucket.blob(bucket_save_path)
#         blob.upload_from_string(base_image, content_type="image/png")
#         # save base image to firestore if base_image_origin is not "storage"
#         db = firestore.client()
#         doc_ref = db.collection("BaseImages").document()
#         doc_ref.set(
#             {
#                 "url": args.get("base_image_link"),
#                 "prompt": args.get("prompt"),
#                 "controlnetPreprocess": args.get("controlnetPreprocess"),
#                 "controlnetModel": args.get("controlnetModel"),
#                 "timestamp": firestore.SERVER_TIMESTAMP,
                
#             }
#         )
#         # those values are sent by client if base_image_origin is "storage"
#         args["parent_uuid"] = doc_ref.id
#         args["base_image_link"] = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path
        
    
#     # send a post request to colabLink with base64 image and args as post data
#     response = requests.post(colabLink, json=args)
    
#     # save response image to storage
#     formated_timestamp = time.strftime("%Y%m%d-%H%M%S")
#     bucket_save_path = "meme_" + formated_timestamp + ".png"
#     blob = bucket.blob(bucket_save_path)
#     blob.upload_from_string(response.text, content_type="image/png")
#     meme_url = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path
    
#     # save generated meme as a child of the base image
#     db = firestore.client()
#     doc_ref= db.collection("AIMemes").document()
#     doc_ref.set(
#         {
#             "url": meme_url,
#             "prompt": args.get("prompt"),
#             "controlnetPreprocess": args.get("controlnetPreprocess"),
#             "controlnetModel": args.get("controlnetModel"),
#             "timestamp": firestore.SERVER_TIMESTAMP,
#             "parent_uuid": args.get("parent_uuid")
            
#         }
#     )
    
#     # return response image
#     return meme_url




if __name__ == '__main__':
    import os
    app.run(threaded=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
