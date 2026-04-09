from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SwiftSure AI - Phase 2")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client (only if API key is available)
client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ClaimRequest(BaseModel):
    amount: float
    description: str

def call_ai_service(prompt: str) -> str:
    """Call OpenAI API with the given prompt."""
    if not client:
        return "AI analysis unavailable. Using fallback logic."
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant for an insurance company analyzing worker risk data. Provide concise, professional responses."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI service error: {e}")
        return "AI analysis unavailable. Using fallback logic."

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
    # Generate sample data
    activity_hours = random.uniform(20, 80)
    claim_history = random.uniform(0, 50)
    fraud_probability = random.uniform(5, 45)
    
    # Call AI for fraud analysis
    prompt = f"""
Evaluate fraud probability for this worker data. Return JSON with:
fraud_probability (number 0-100), risk_level (Low/Medium/High), ai_reason (string).

Data:
- activity hours: {activity_hours:.1f}
- claim history: {claim_history:.1f}
- fraud indicators: {fraud_probability:.1f}

Return only valid JSON, no extra text.
"""
    
    ai_response = call_ai_service(prompt)
    
    try:
        import json
        result = json.loads(ai_response)
        fraud_probability = float(result.get('fraud_probability', fraud_probability))
        risk_level = result.get('risk_level', 'Medium')
        ai_reason = result.get('ai_reason', 'AI analysis completed.')
    except:
        # Fallback
        if fraud_probability > 65:
            risk_level = "High"
            ai_reason = "High fraud indicators detected in activity patterns."
        elif fraud_probability > 30:
            risk_level = "Medium"
            ai_reason = "Moderate fraud risk based on claim history."
        else:
            risk_level = "Low"
            ai_reason = "Low fraud probability with stable activity."
    
    return {
        "fraud_probability": f"{int(fraud_probability)}%",
        "risk_level": risk_level,
        "ai_reason": ai_reason
    }

@app.get("/risk-score")
def get_risk_score():
    # Generate sample worker data
    activity_hours = random.uniform(20, 80)
    claim_history = random.uniform(0, 50)
    fraud_probability = random.uniform(5, 45)
    
    # Call AI for analysis
    prompt = f"""
Analyze this worker data and return JSON with:
risk_score, risk_level, recommended_premium, ai_insight.

Data:
- activity hours: {activity_hours:.1f}
- claim history: {claim_history:.1f}
- fraud probability: {fraud_probability:.1f}

Return only valid JSON, no extra text.
"""
    
    ai_response = call_ai_service(prompt)
    
    try:
        # Try to parse AI response as JSON
        import json
        result = json.loads(ai_response)
        risk_score = float(result.get('risk_score', 50))
        risk_level = result.get('risk_level', 'Medium')
        recommended_premium = result.get('recommended_premium', '$250/mo')
        ai_insight = result.get('ai_insight', 'AI analysis completed.')
    except:
        # Fallback to old logic if AI fails
        risk_score = (0.5 * activity_hours) + (0.3 * claim_history) + (0.2 * fraud_probability)
        risk_score = round(min(100, max(0, risk_score)), 1)
        
        if risk_score <= 30:
            risk_level = "Low"
            ai_insight = "Worker activity is stable with minimal fraud signals."
            recommended_premium = "$120/mo"
        elif risk_score <= 60:
            risk_level = "Medium"
            ai_insight = "Moderate risk detected due to inconsistent activity patterns."
            recommended_premium = "$250/mo"
        else:
            risk_level = "High"
            ai_insight = "High alert: Elevated fraud probability and volatile activity."
            recommended_premium = "$450/mo"
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommended_premium": recommended_premium,
        "fraud_probability": fraud_probability,
        "ai_insight": ai_insight
    }

@app.get("/ai-recommendations")
def get_recommendations():
    # Generate sample worker data
    activity_hours = random.uniform(20, 80)
    claim_history = random.uniform(0, 50)
    fraud_probability = random.uniform(5, 45)
    risk_score = (0.5 * activity_hours) + (0.3 * claim_history) + (0.2 * fraud_probability)
    
    # Call AI for recommendations
    prompt = f"""
Generate 3-5 personalized insurance recommendations based on this worker data. Return JSON with array of strings.

Data:
- activity hours: {activity_hours:.1f}
- claim history: {claim_history:.1f}
- fraud probability: {fraud_probability:.1f}
- risk score: {risk_score:.1f}

Return only valid JSON array of strings, no extra text.
"""
    
    ai_response = call_ai_service(prompt)
    
    try:
        import json
        recommendations = json.loads(ai_response)
        if not isinstance(recommendations, list):
            recommendations = [str(recommendations)]
    except:
        # Fallback recommendations
        recommendations = [
            "Reduce risk by enforcing stricter safety protocols this month.",
            "Fraud probability is within acceptable limits.",
            "Consider premium optimization based on recent stable activity.",
            "Review claims history from the last quarter for anomalies."
        ]
    
    return {"recommendations": recommendations[:5]}  # Limit to 5

@app.get("/worker-activity")
def get_worker_activity():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    # Realistic dip on weekends
    return [
        {"day": day, "hours_logged": random.randint(6, 10) if day not in ["Sat", "Sun"] else random.randint(0, 4)}
        for day in days
    ]

@app.post("/submit-claim")
def submit_claim(claim: ClaimRequest):
    # Simulate AI analysis delay
    time.sleep(1) 
    
    # Generate sample data
    activity_hours = random.uniform(20, 80)
    claim_history = random.uniform(0, 50)
    fraud_probability = random.uniform(5, 45)
    
    # Call AI for claim decision
    prompt = f"""
Analyze this claim and decide approval. Return JSON with:
fraud_risk (number 0-100), decision (Approved/Rejected/Under Review), ai_analysis (string).

Claim details:
- Amount: ${claim.amount}
- Description: {claim.description}
- Worker activity hours: {activity_hours:.1f}
- Claim history: {claim_history:.1f}
- Fraud indicators: {fraud_probability:.1f}

Return only valid JSON, no extra text.
"""
    
    ai_response = call_ai_service(prompt)
    
    try:
        import json
        result = json.loads(ai_response)
        fraud_risk = float(result.get('fraud_risk', fraud_probability))
        decision = result.get('decision', 'Under Review')
        ai_analysis = result.get('ai_analysis', 'AI analysis completed.')
    except:
        # Fallback logic
        fraud_risk = fraud_probability
        if fraud_risk > 65 or claim.amount > 50000:
            decision = "Rejected"
            ai_analysis = "High fraud probability detected based on historical claim patterns and amount."
        elif fraud_risk > 30:
            decision = "Under Review"
            ai_analysis = "Claim flagged for manual review due to moderate risk indicators."
        else:
            decision = "Approved"
            ai_analysis = "Claim aligns with standard parameters. Low fraud risk."

    return {
        "claim_id": f"CLM-{random.randint(1000, 9999)}",
        "fraud_risk": round(fraud_risk, 1),
        "decision": decision,
        "ai_analysis": ai_analysis
    }

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
    # Generate sample data
    current_risk = random.uniform(20, 70)
    trend_data = [current_risk + random.uniform(-5, 5) for _ in range(6)]
    
    # Call AI for prediction
    prompt = f"""
Predict future risk based on this trend data. Return JSON with:
predicted_risk_score (number 0-100), trend (Increasing/Stable/Decreasing), explanation (string).

Current data trend: {trend_data}

Return only valid JSON, no extra text.
"""
    
    ai_response = call_ai_service(prompt)
    
    try:
        import json
        result = json.loads(ai_response)
        predicted_risk_score = float(result.get('predicted_risk_score', current_risk))
        trend = result.get('trend', 'Stable')
        explanation = result.get('explanation', 'AI prediction completed.')
    except:
        # Fallback
        predicted_risk_score = round(current_risk + random.uniform(-10, 10), 1)
        if predicted_risk_score > current_risk + 5:
            trend = "Increasing"
            explanation = "Risk showing upward trend based on recent activity patterns."
        elif predicted_risk_score < current_risk - 5:
            trend = "Decreasing"
            explanation = "Risk decreasing due to improved safety compliance."
        else:
            trend = "Stable"
            explanation = "Risk levels remain stable with current patterns."
    
    return {
        "predicted_risk_score": predicted_risk_score,
        "trend": trend,
        "explanation": explanation
    }