from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "SwiftSure API Running"}

@app.get("/policy")
def get_policy():
    return {
        "status": "Active",
        "premium": 45
    }

def get_risk_level(score: int) -> str:
    if score < 30:
        return "Low"
    if score < 60:
        return "Medium"
    return "High"

@app.get("/worker-profile")
def worker_profile():
    base_score = random.randint(10, 85)
    risk_level = get_risk_level(base_score)
    return {
        "name": "Ravi Kumar",
        "policy_status": "Active",
        "weekly_premium": 45,
        "risk_score": risk_level,
    }

@app.get("/fraud-check")
def fraud_check():
    probability = random.randint(5, 25)
    return {
        "fraud_probability": f"{probability}%",
        "risk_level": "Low" if probability < 15 else "High",
    }

@app.get("/risk-score")
def risk_score():
    score = random.randint(10, 90)
    level = get_risk_level(score)
    premium = 35 + (90 - score) // 2
    return {
        "risk_score": score,
        "risk_level": level,
        "recommended_premium": premium,
    }

@app.post("/submit-claim")
def submit_claim():
    return {
        "message": "Claim submitted successfully",
        "claim_id": "CLM1024"
    }

@app.get("/risk-trend")
def risk_trend():
    base_score = random.randint(60, 90)
    return [
        {"month": "Jan", "score": base_score - 5},
        {"month": "Feb", "score": base_score - 3},
        {"month": "Mar", "score": base_score - 4},
        {"month": "Apr", "score": base_score - 2},
        {"month": "May", "score": base_score - 6},
        {"month": "Jun", "score": base_score},
    ]

@app.get("/worker-activity")
def worker_activity():
    return [
        {"day": "Mon", "tasks": random.randint(3, 9)},
        {"day": "Tue", "tasks": random.randint(3, 9)},
        {"day": "Wed", "tasks": random.randint(3, 9)},
        {"day": "Thu", "tasks": random.randint(3, 9)},
        {"day": "Fri", "tasks": random.randint(3, 9)},
        {"day": "Sat", "tasks": random.randint(1, 5)},
    ]
