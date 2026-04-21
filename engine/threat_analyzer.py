"""
Threat Intelligence NLP Module
Handles severity classification and sentiment analysis on news headlines.
"""

import re

class ThreatAnalyzer:
    def __init__(self):
        # Lexicon for heuristic severity classification
        self.critical_tokens = ['civil war', 'invasion', 'nuclear', 'assassination', 'failed state', 'famine']
        self.high_tokens = ['sanctions', 'riot', 'cyber-attack', 'embargo', 'clash', 'deployment']
        self.medium_tokens = ['protest', 'dispute', 'inflation', 'scandal', 'election']

    def analyze_headline(self, text):
        """
        Performs heuristic analysis on headlines.
        In production, this would call a fine-tuned Transformer model (e.g., BERT).
        """
        text_lower = text.lower()
        
        # Determine Severity
        severity = 'low'
        if any(token in text_lower for token in self.critical_tokens):
            severity = 'critical'
        elif any(token in text_lower for token in self.high_tokens):
            severity = 'high'
        elif any(token in text_lower for token in self.medium_tokens):
            severity = 'medium'

        # Sentiment estimation (Simplified)
        # -1.0 (Very Negative) to 1.0 (Positive)
        negative_words = len(re.findall(r'(death|war|bomb|crisis|threat|down|fall|attack)', text_lower))
        sentiment = max(-1.0, 0.0 - (negative_words * 0.2))

        return {
            'text': text,
            'severity': severity,
            'sentiment': round(sentiment, 2),
            'ai_confidence': 0.89 # Mock confidence for the simulation
        }

if __name__ == "__main__":
    analyzer = ThreatAnalyzer()
    test_headline = "Unexpected cyber-attack on energy infrastructure triggers regional sanctions"
    result = analyzer.analyze_headline(test_headline)
    print(result)
