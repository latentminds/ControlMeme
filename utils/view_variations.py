import pandas as pd
import plotly.express as px
from dash import Dash, html, dcc, ctx
import gradio as gr
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, State
import dash


def query_varaiation():
    base_memes_collection = firestore_client.collection(u'BaseMemes').stream()
    base_meme_docs = [
        {
            "uuid": doc.id,
            "url": doc.to_dict()["url"]
        } for doc in base_memes_collection
    ]

    variation_collection = firestore_client.collection(u'Variations').stream()
    variation_docs = [
        {
            "uuid": doc.id,
            "prompt": doc.to_dict()["prompt"],
            "url": doc.to_dict()["url"],
            "parent_uuid": doc.to_dict()["parent_uuid"],
            "parent_url": ""
        } for doc in variation_collection
    ]

    # join the two lists of dicts to get the parent_url
    for variation_doc in variation_docs:
        for base_meme_doc in base_meme_docs:
            if variation_doc["parent_uuid"] == base_meme_doc["uuid"]:
                variation_doc["parent_url"] = base_meme_doc["url"]

    return variation_docs


def get_table_base_memes(docs):
    """Get BaseMemes collection from Firestore and return a table
        The table contains the following columns:
            - uuid
            - <img> with the meme image url field
            - a button to delete the meme
    """
    print(docs[0])

    table = dbc.Table(
        [
            html.Thead(
                html.Tr(
                    [
                        html.Th("Variation UUID"),
                        html.Th("Parent UUID"),
                        html.Th("Variation Image"),
                        html.Th("Parent Image"),
                    ]
                )
            ),
            html.Tbody(
                [
                    html.Tr(
                        [
                            html.Td(doc["uuid"], id=f"uuid_{doc['uuid']}"),
                            html.Td(doc["parent_uuid"],
                                    id=f"parent_uuid_{doc['uuid']}"),
                            html.Td(html.Img(src=doc["url"], width=100)),
                            html.Td(
                                html.Img(src=doc["parent_url"], width=100)),

                        ]
                    ) for doc in docs
                ]
            )
        ]
    )
    return table


cred = credentials.Certificate(
    "/workspaces/controlmeme-admin/sa_firebase.json")
firebase_admin.initialize_app(cred)
firestore_client = firestore.client()


app = Dash(__name__)

variations_docs_with_parent_url = query_varaiation()

app.layout = html.Div(children=[
    html.H1(children='Base Memes  Admin'),
    html.Button("Update table", id="update_table"),
    html.Div(id="table_base_memes", children=get_table_base_memes(
        variations_docs_with_parent_url))

])


if __name__ == '__main__':
    app.run_server(debug=True)
