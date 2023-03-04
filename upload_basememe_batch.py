import glob
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
import time
import requests
import os
import random
from PIL import Image

cred = credentials.Certificate("./firebase_key.json")
app = initialize_app(cred)
db = firestore.client()

storage_client = storage.Client()
bucket = storage_client.get_bucket("control-meme-public")


image_folder = "./newmemes/"
image_folder_full = os.path.abspath(image_folder)

print(image_folder_full)


def add_variation_to_data(image_path_local, url, name):

    # save meme variation to bucket

    formated_timestamp = time.strftime("%Y%m%d-%H%M%S")
    bucket_save_path = "meme_variation_" + formated_timestamp + ".jpeg"
    blob = bucket.blob(bucket_save_path)
    blob.upload_from_filename(image_path_local, content_type="image/jpeg")
    url = "https://storage.googleapis.com/control-meme-public/" + bucket_save_path

    variation_data = {
        "url": url,
        "name": name,
        "timestamp": firestore.SERVER_TIMESTAMP,  # type: ignore
    }

    db = firestore.client()
    # save meme variation to firestore in the Variations collection with parent memeID in attribute parent_uuid
    doc_ref = db.collection("BaseMemes").document()
    doc_ref.set(variation_data)


# for all path in the folder
for path in glob.glob(image_folder_full + "/*"):
    print(path)
    # get the name of the file
    name = os.path.basename(path)
    # generate random suffix
    suffix = random.randint(0, 100000)
    name = name + "_" + str(suffix)
    full_path = image_folder_full + "/" + name + ".jpeg"

    # read image and save it with the new name as jpeg
    image_pil = Image.open(path).convert('RGB')

    image_pil.save(full_path, "JPEG")

    # get the url of the file
    url = "https://storage.googleapis.com/control-meme-public/" + name + ".jpeg"
    # add the variation to the database
    add_variation_to_data(full_path, url, name)
