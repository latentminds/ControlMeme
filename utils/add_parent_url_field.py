import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate(
    "/workspaces/controlmeme-admin/sa_firebase.json")
firebase_admin.initialize_app(cred)
firestore_client = firestore.client()

# fetch base memes from firestore
base_memes_collection = firestore_client.collection(u'BaseMemes').stream()
base_meme_docs = [
    {
        "uuid": doc.id,
        "image_url": doc.to_dict()["url"]
    } for doc in base_memes_collection
]

# fetch variations from firestore
variations_collection = firestore_client.collection(u'Variations').stream()
variation_docs = [
    {
        "uuid": doc.id,
        "url": doc.to_dict()["url"],
        "parent_uuid": doc.to_dict()["parent_uuid"],
        "parent_url": ""
    } for doc in variations_collection
]

# create a list of dicts with the variations data and the url of the parent meme with parent_uuid = base_meme uuid
for variation_doc in variation_docs:
    for base_meme_doc in base_meme_docs:
        if variation_doc["parent_uuid"] == base_meme_doc["uuid"]:
            variation_doc["parent_url"] = base_meme_doc["image_url"]


# update variations with parent_url
for variation_doc in variation_docs:
    firestore_client.collection(u'Variations').document(variation_doc["uuid"]).update({
        u'parent_url': variation_doc["parent_url"]
    })
