from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.ensemble import GradientBoostingClassifier

class Predictor:
    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.model = self._load()

    def _load(self):
        if not self.model_path.exists():
            # generate synthetic data and train a quick model
            X, y = self._generate_synthetic()
            model = xgb.XGBClassifier(use_label_encoder=False, eval_metric="logloss")
            model.fit(X, y)
            joblib.dump(model, self.model_path)
            return model
        return joblib.load(self.model_path)

    def reload(self, new_path: Path):
        self.model_path = new_path
        self.model = self._load()

    def predict_proba(self, features: dict) -> np.ndarray:
        arr = np.array([list(features.values())], dtype=float)
        return self.model.predict_proba(arr)[0]

    @staticmethod
    def _generate_synthetic(samples: int = 200):
        rng = np.random.default_rng()
        X = rng.normal(size=(samples, 3))
        y = (X[:, 0] * 0.3 + X[:, 1] * 0.5 + X[:, 2] * 0.2 > 0).astype(int)
        df = pd.DataFrame(X, columns=["age", "income", "credit_score"])
        return df, y

class Trainer:
    def __init__(self, csv_path: str, target: str, model_type: str = "xgboost"):
        self.df = pd.read_csv(csv_path)
        self.X = self.df.drop(columns=[target])
        self.y = self.df[target]
        self.model_type = model_type.lower()

    def fit(self):
        if self.model_type == "xgboost":
            model = xgb.XGBClassifier(use_label_encoder=False, eval_metric="logloss")
        else:
            model = GradientBoostingClassifier()
        model.fit(self.X, self.y)
        self.model = model
        return model

    def save_model(self, path: Path):
        joblib.dump(self.model, path)
        return path
