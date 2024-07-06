import requests
import os
from jinja2 import Environment, FileSystemLoader
import json


# complete workflow templates
def fill_template(template_name: str, **kwargs) -> dict:
    file_loader = FileSystemLoader("workflows")
    env = Environment(loader=file_loader)

    # Load the template
    template = env.get_template(f"{template_name}.json.j2")

    # Render the template with the data
    rendered_json = template.render(kwargs)
    # convert str to dict
    return json.loads(rendered_json)


# call comfyUI runpod api
def comfy_workflow(b64_input: str, workflow: dict) -> str:
    runpod_api_key = os.environ["RUNPOD_API_KEY"]
    runpod_endpoint_id = os.environ["RUNPOD_ENDPOINT_ID"]

    res = requests.post(
        url=f"https://api.runpod.ai/v2/{runpod_endpoint_id}/runsync",
        headers={"Authorization": f"Bearer {runpod_api_key}"},
        json={
            "input": {
                "workflow": workflow,
                "images": [{"name": "example.png", "image": b64_input}],
            }
        },
    )

    return res.json()
