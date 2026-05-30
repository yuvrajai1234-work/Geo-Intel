from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn

# Import engine modules
from gdelt_client import GDELTClient
from threat_analyzer import ThreatAnalyzer
from risk_predictor import RiskPredictor
from forex_anomaly import ForexAnomalyDetector

app = FastAPI(title="Geo-Intel AI Engine API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engine Components
gdelt = GDELTClient()
threat_analyzer = ThreatAnalyzer()
risk_predictor = RiskPredictor()
forex_detector = ForexAnomalyDetector()

class RiskRequest(BaseModel):
    country_code: str
    metrics: Dict[str, float]

class ForexRequest(BaseModel):
    data: List[float]
    threshold: Optional[float] = 2.5

@app.get("/")
async def root():
    return {"status": "online", "message": "Geo-Intel Intelligence Engine is running"}

@app.get("/api/threats")
async def get_threats(limit: int = 10):
    """Fetch and analyze recent threats from GDELT."""
    try:
        articles = gdelt.fetch_recent_threats(max_records=limit)
        if not articles:
            return {"message": "No live data available", "data": []}
        
        headlines = [a.get('title') for a in articles if a.get('title')]
        results = threat_analyzer.analyze_batch(headlines)
        
        # Merge article metadata with analysis results
        combined = []
        for i, res in enumerate(results):
            combined.append({
                **res,
                "url": articles[i].get("url"),
                "source": articles[i].get("source"),
                "domain": articles[i].get("domain")
            })
            
        return {"count": len(combined), "data": combined}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-risk")
async def predict_risk(request: RiskRequest):
    """Calculate risk score for a specific country based on metrics."""
    try:
        result = risk_predictor.calculate_country_risk(request.country_code, request.metrics)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/forex-anomalies")
async def detect_forex_anomalies(request: ForexRequest):
    """Detect anomalies in forex time series data."""
    try:
        detector = ForexAnomalyDetector(threshold=request.threshold)
        anomalies = detector.detect_anomalies(request.data)
        return {"count": len(anomalies), "anomalies": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print(">>> Starting Geo-Intel Backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
