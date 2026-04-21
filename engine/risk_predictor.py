import numpy as np
from datetime import datetime

class RiskPredictor:
    """
    Core Risk Prediction Engine for Geo-Intel
    Combines weighted metrics from News (GDELT), Financial Markets, and Compliance data.
    """
    def __init__(self):
        # Weights for the global risk score calculation
        self.weights = {
            'sentiment': 0.35,      # NLP based news sentiment
            'volatility': 0.25,     # Market anomaly scores
            'compliance': 0.20,     # Sanctions/OFAC matching
            'incident_freq': 0.20    # Frequency of physical security incidents
        }

    def calculate_country_risk(self, country_code, raw_metrics):
        """
        Calculates a risk score (0-100) for a given country.
        """
        score = (
            raw_metrics['sentiment_score'] * self.weights['sentiment'] +
            raw_metrics['market_volatility'] * self.weights['volatility'] +
            raw_metrics['sanction_weight'] * self.weights['compliance'] +
            raw_metrics['incident_density'] * self.weights['incident_freq']
        )
        
        # Clamp score between 0 and 100
        final_score = max(0, min(100, score * 10))
        
        return {
            'country_code': country_code,
            'risk_score': round(final_score, 2),
            'risk_level': self._get_risk_level(final_score),
            'timestamp': datetime.utcnow().isoformat()
        }

    def _get_risk_level(self, score):
        if score > 80: return 'critical'
        if score > 60: return 'high'
        if score > 40: return 'medium'
        return 'low'

# Example Usage
if __name__ == "__main__":
    predictor = RiskPredictor()
    # Mock raw data for Ukraine (UA)
    ua_metrics = {
        'sentiment_score': 8.5,
        'market_volatility': 7.2,
        'sanction_weight': 9.0,
        'incident_density': 9.5
    }
    print(predictor.calculate_country_risk('UA', ua_metrics))
