from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time

app = FastAPI(title="SwiftSure AI - Phase 2")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    amount: float
    description: str

# Helper to generate consistent baseline risk for a session
def get_base_metrics():
    activity_risk = random.uniform(10, 80)
    claim_history = random.uniform(0, 60)
    fraud_prob = random.uniform(5, 50)
    
    # AI Risk Formula
    risk_score = (0.5 * activity_risk) + (0.3 * claim_history) + (0.2 * fraud_prob)
    
    # Determine Risk Level
    if risk_score <= 30:
        level = "Low"
        insight = "Worker activity is stable with minimal fraud signals."
        premium = "$120/mo"
    elif risk_score <= 60:
        level = "Medium"
        insight = "Moderate risk detected due to inconsistent activity patterns."
        premium = "$250/mo"
    else:
        level = "High"
        insight = "High alert: Elevated fraud probability and volatile activity."
        premium = "$450/mo"
        
    return round(risk_score, 1), level, insight, premium, round(fraud_prob, 1)

@app.get("/worker-profile")
def get_worker_profile():
    profiles = [
        {"name": "John Doe", "policy_status": "Active", "weekly_premium": 280},
        {"name": "Jane Smith", "policy_status": "Active", "weekly_premium": 320},
        {"name": "Mike Johnson", "policy_status": "Active", "weekly_premium": 250},
    ]
    return random.choice(profiles)

@app.get("/fraud-check")
def get_fraud_check():
    score, level, insight, premium, fraud = get_base_metrics()
    return {
        "fraud_probability": f"{int(fraud)}%",
        "risk_level": level
    }

@app.get("/risk-score")
def get_risk_score():
    score, level, insight, premium, fraud = get_base_metrics()
    return {
        "risk_score": score,
        "risk_level": level,
        "recommended_premium": premium,
        "fraud_probability": fraud,
        "ai_insight": insight
    }

@app.get("/ai-recommendations")
def get_recommendations():
    recs = [
        "Reduce risk by enforcing stricter safety protocols this month.",
        "Fraud probability is within acceptable limits.",
        "Consider premium optimization based on recent stable activity.",
        "Review claims history from the last quarter for anomalies."
    ]
    # Return 3 random recommendations to simulate dynamic analysis
    return {"recommendations": random.sample(recs, 3)}

@app.post("/submit-claim")
def submit_claim(claim: ClaimRequest):
    # Simulate AI analysis delay
    time.sleep(1) 
    
    fraud_risk = random.uniform(5, 85)
    
    if fraud_risk > 65 or claim.amount > 50000:
        decision = "Rejected"
        analysis = "High fraud probability detected based on historical claim patterns and amount."
    elif fraud_risk > 30:
        decision = "Under Review"
        analysis = "Claim flagged for manual review due to moderate risk indicators."
    else:
        decision = "Approved"
        analysis = "Claim aligns with standard parameters. Low fraud risk."

    return {
        "claim_id": f"CLM-{random.randint(1000, 9999)}",
        "fraud_risk": round(fraud_risk, 1),
        "claim_decision": decision,
        "ai_analysis": analysis
    }

@app.get("/worker-activity")
def get_worker_activity():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    # Realistic dip on weekends
    return [
        {"day": day, "hours_logged": random.randint(6, 10) if day not in ["Sat", "Sun"] else random.randint(0, 4)}
        for day in days
    ]

@app.get("/risk-trend")
def get_risk_trend():
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    base_trend = 40
    data = []
    for month in months:
        base_trend += random.uniform(-10, 15) # Simulating changing monthly patterns
        data.append({"month": month, "avg_risk": round(max(10, min(90, base_trend)), 1)})
    return data

@app.get("/risk-prediction")
def get_risk_prediction():
    return {
        "predicted_next_month_score": round(random.uniform(20, 70), 1),
        "confidence_interval": "85%",
        "prediction_reason": "Based on slight upward trend in recent claim frequency."
    }