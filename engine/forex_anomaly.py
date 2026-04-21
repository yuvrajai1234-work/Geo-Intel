import numpy as np

class ForexAnomalyDetector:
    """
    Statistical Anomaly Detection for Forex Markets.
    Identifies 'Sigma' deviations that correlate with geopolitical instability.
    """
    def __init__(self, threshold=3.0):
        self.threshold = threshold # Z-Score threshold (Standard Deviations)

    def detect_anomalies(self, time_series_data):
        """
        Calculates Z-Scores for a series of exchange rates.
        Returns indices and values of data exceeding the threshold.
        """
        data = np.array(time_series_data)
        mean = np.mean(data)
        std = np.std(data)
        
        if std == 0:
            return []

        z_scores = (data - mean) / std
        anomalies = []
        
        for i, z in enumerate(z_scores):
            if abs(z) > self.threshold:
                anomalies.append({
                    'index': i,
                    'value': data[i],
                    'z_score': round(z, 2),
                    'severity': 'critical' if abs(z) > (self.threshold + 2) else 'high'
                })
                
        return anomalies

if __name__ == "__main__":
    detector = ForexAnomalyDetector(threshold=2.5)
    # Mock USD/TRY exchange rate data with a sudden spike
    market_data = [18.2, 18.3, 18.25, 18.4, 18.35, 24.5, 23.8, 23.2]
    anomalies = detector.detect_anomalies(market_data)
    print(f"Detected {len(anomalies)} anomalies in market stream:")
    for a in anomalies:
        print(a)
