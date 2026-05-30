import requests
import json
from typing import List, Dict

class GDELTClient:
    """
    Client for interacting with the GDELT Project API.
    Specifically uses the DOC API v2 to fetch recent news articles related to global threats.
    """
    
    BASE_URL = "https://api.gdeltproject.org/api/v2/doc/doc"

    def fetch_recent_threats(self, query: str = "(threat OR conflict OR crisis OR military)", max_records: int = 10) -> List[Dict]:
        """
        Fetches recent articles matching the threat query.
        """
        params = {
            "query": query,
            "mode": "ArtList",
            "format": "json",
            "maxrecords": max_records,
            "timespan": "24h"
        }
        
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            articles = data.get("articles", [])
            return articles
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching GDELT data: {e}")
            return []
        except json.JSONDecodeError:
            print("Error decoding GDELT JSON response")
            return []

if __name__ == "__main__":
    client = GDELTClient()
    print("Fetching live intelligence from GDELT...")
    results = client.fetch_recent_threats()
    
    if results:
        for i, article in enumerate(results):
            print(f"\n[{i+1}] {article.get('title')}")
            print(f"    Source: {article.get('source')}")
            print(f"    URL: {article.get('url')}")
    else:
        print("No results found or error occurred.")
