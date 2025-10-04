# To run this code you need to install the following dependencies:
# pip install google-genai

import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json


load_dotenv()

# It's good practice to handle the case where the key might be missing
api_key = os.environ.get("GOOGLEKEY")
if not api_key:
    raise ValueError("GOOGLEKEY environment variable not set!")

client = genai.Client(api_key=api_key)

# The model name in your code was for a non-existent model.
# Using a valid Gemini model with vision capabilities.
MODEL_NAME = "gemma-3-12b-it"

CONVO_PROMPT = f""""""
TYPES_CONVO_PROMPT = types.Part.from_text(text=CONVO_PROMPT)


def getConvoResponse(convo: list):
    """
    takes in convo and streams the text response

    Parameters:
        convo (str): list of past messages
    Returns:
        res (str | dict): ai response or dict with shape { "top": [ {...}, {...} ], "jewelry": [ {...} ] }
    """
    history = build(convo)
    cfg = types.GenerateContentConfig()
    print(convo, history)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=history,
        config=cfg,
    ).text

    if response[:7] != "```json":
        return response
    else:
        return json.loads(response[8:-4])


def build(convo):
    """Build ai history from convo"""
    contents: list[types.Content] = []

    contents.append(types.Content(role="user", parts=[TYPES_CONVO_PROMPT]))
    # {"convo": [{"content": "Hi", "role": "user"}, {"content": "Hmm, I received an unexpected response format.", "role": "model"}, {"content": "H", "role": "user"}]F
    for message in convo:
        role = message["role"]
        content = message["content"]
        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=content)]))
    return contents
