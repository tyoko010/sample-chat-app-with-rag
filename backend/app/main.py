import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List, Optional

from engine import OpenAIEngine

app = FastAPI()

class RetrieveRequest(BaseModel):
    question: str

class RetrieveResponse(BaseModel):
    answer: str
    sources: List[str]

@app.post("/api/retrieve", response_model=RetrieveResponse)
def retrieve(req: RetrieveRequest):
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

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "gpt-4o-mini"

class ChatResponse(BaseModel):
    message: str

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    ユーザーからの質問に対してRAG情報を元に回答します。
    回答には参照した情報のURLが含まれます。
    """
    engine = OpenAIEngine(os.environ.get("OPENAI_API_KEY"))

    message = engine.chat(req.message, req.model)

    return ChatResponse(
        message=message
    )

@app.get("/api/model")
def list_models():
    """
    利用可能なモデルの一覧を取得します。
    """
    engine = OpenAIEngine(os.environ.get("OPENAI_API_KEY"))

    return engine.list_models()