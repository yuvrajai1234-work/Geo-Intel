import asyncio
import json
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from app.models import Predictor, Trainer
from app.pipeline import news_cache, fetch_latest_gdelt, schedule_daily_fetch

app = FastAPI(title="Geo‑Intel API", version="0.1")

# Initialise model (will auto‑train synthetic if missing)
MODEL_PATH = Path(__file__).parent.parent / "models" / "risk_model.pkl"
predictor = Predictor(MODEL_PATH)

# ---------- SSE generator ---------------------------------------------------
async def _event_generator():
    last_index = 0
    while True:
        if last_index < len(news_cache):
            for item in news_cache[last_index:]:
                yield f"data: {json.dumps(item)}\n\n"
            last_index = len(news_cache)
        await asyncio.sleep(5)

@app.get("/news/stream", response_class=StreamingResponse)
async def stream_news():
    return StreamingResponse(_event_generator(), media_type="text/event-stream")

# ---------- Cached news list ------------------------------------------------
@app.get("/news")
def get_news(limit: int = 20):
    return JSONResponse(content=news_cache[:limit])

# ---------- Predict ----------------------------------------------------------
class PredictRequest(BaseModel):
    age: float
    income: float
    credit_score: float

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        prob = predictor.predict_proba(req.dict())
        return {"risk_score": prob[1], "risk_class": int(prob[1] > 0.5)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))

# ---------- Train (manual trigger) ------------------------------------------
@app.post("/train")
def train(data_path: str = "data/synthetic/training.csv", target: str = "label", model: str = "xgboost"):
    trainer = Trainer(data_path, target, model)
    trainer.fit()
    trainer.save_model(MODEL_PATH)
    predictor.reload(MODEL_PATH)
    return {"msg": "model trained and reloaded"}

# ---------- Startup ----------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    # immediate fetch so UI has data
    await fetch_latest_gdelt()
    # schedule daily fetch at 02:00 UTC
    schedule_daily_fetch()
