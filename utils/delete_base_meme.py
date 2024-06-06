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
                        html.Th("uuid"),
                        html.Th("Image"),
                        html.Th("Delete"),
                    ]
                )
            ),
            html.Tbody(
                [
                    html.Tr(
                        [
                            html.Td(doc["uuid"], id=f"uuid_{doc['uuid']}"),
                            html.Td(html.Img(src=doc["url"], width=100)),
                            html.Td(dbc.Button("Delete", color="danger",
                                    id=f"delete_{doc['uuid']}")),
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

base_memes_collection = firestore_client.collection(u'BaseMemes').stream()
base_meme_docs = [
    {
        "uuid": doc.id,
        "url": doc.to_dict()["url"],
        'timestamp': doc.to_dict().get("timestamp")
    } for doc in base_memes_collection
]
# order by url
base_meme_docs.sort(key=lambda x: x["url"])


app.layout = html.Div(children=[
    html.H1(children='Base Memes  Admin'),
    html.Button("Update table", id="update_table"),
    html.Div(id="table_base_memes",
             children=get_table_base_memes(base_meme_docs))

])


# callback to delete a meme from firestore
# input is a list of n_clicks for each delete button and state is list of uuids
# output is disabled button
@app.callback(
    [Output(f"delete_{doc['uuid']}", "disabled") for doc in base_meme_docs],
    [Input(f"delete_{doc['uuid']}", "n_clicks") for doc in base_meme_docs]
)
def delete_meme(*args):
    if ctx.triggered is None:
        return dash.no_update
    called_uuid = ctx.triggered[0]["prop_id"].split(".")[0].split("_")[1]
    print(f"Deleting meme with uuid {called_uuid}")
    firestore_client.collection(u'BaseMemes').document(called_uuid).delete()

    return [False for _ in range(len(base_meme_docs))]


if __name__ == '__main__':
    app.run_server(debug=True, port=8051)
