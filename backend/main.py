import os

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from engine import OpenAIEngine

app = FastAPI()

class RetrieveRequest(BaseModel):
    question: str

class RetrieveResponse(BaseModel):
    answer: str
    sources: List[str]

@app.post("/retrieve", response_model=RetrieveResponse)
def query_api(req: RetrieveRequest):
    """
    ユーザーからの質問に対してRAG情報を元に回答します。
    回答には参照した情報のURLが含まれます。
    """
    engine = OpenAIEngine(os.environ.get("OPENAI_API_KEY"))

    answer, sources = engine.answer(req.question)

    return RetrieveResponse(
        answer=answer,
        sources=sources
    )
