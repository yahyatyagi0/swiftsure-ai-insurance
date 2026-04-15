from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
import os
import json
from typing import Optional, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
import httpx

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
openai_key = os.getenv("OPENAI_API_KEY")
if openai_key:
    client = OpenAI(api_key=openai_key.strip())

class ClaimRequest(BaseModel):
    amount: float
    description: str
    trigger_reason: Optional[str] = None

def call_ai_service(prompt: str) -> str:
    """Call OpenAI API with the given prompt."""
    if not client:
        return "AI analysis unavailable. Using fallback logic."
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant for an insurance company analyzing worker risk data. Provide concise, professional responses in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=220,
            temperature=0.2
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI service error: {e}")
        return "AI analysis unavailable. Using fallback logic."

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY") or os.getenv("WEATHER_KEY")
WEATHER_CITY = (os.getenv("WEATHER_CITY") or os.getenv("WEATHER_LOCATION") or "Delhi").strip()

def fetch_weather_data(city: str = WEATHER_CITY) -> Dict[str, Any]:
    """Fetch current weather from OpenWeather API."""
    if not WEATHER_API_KEY:
        print("Weather API key is not configured.")
        return {
            "rainfall_mm": 0.0,
            "temperature": 0.0,
            "condition": "Unavailable",
            "raw": {},
            "available": False,
        }

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }

    try:
        with httpx.Client(timeout=10.0) as client_http:
            response = client_http.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        rainfall_mm = 0.0
        if isinstance(data.get("rain"), dict):
            rainfall_mm = float(data["rain"].get("1h", data["rain"].get("3h", 0.0)))

        temperature = float(data.get("main", {}).get("temp", 0.0))
        condition = "Unknown"
        weather = data.get("weather")
        if isinstance(weather, list) and weather:
            condition = weather[0].get("main", "Unknown")

        return {
            "rainfall_mm": round(rainfall_mm, 1),
            "temperature": round(temperature, 1),
            "condition": condition,
            "raw": data,
            "available": True,
        }
    except Exception as exc:
        print(f"Weather API fetch error: {exc}")
        return {
            "rainfall_mm": 0.0,
            "temperature": 0.0,
            "condition": "Unavailable",
            "raw": {},
            "available": False,
        }


def process_claim(amount: float, description: str, trigger_reason: Optional[str] = None) -> Dict[str, Any]:
    """Centralized claim process logic used by endpoints and auto triggers."""
    time.sleep(1)
    activity_hours = random.uniform(20, 80)
    claim_history = random.uniform(0, 50)
    fraud_probability = random.uniform(5, 45)

    prompt = f"""
Analyze this claim and decide approval. Return JSON with:
fraud_risk (number 0-100), decision (Approved/Rejected/Under Review), ai_analysis (string).

Claim details:
- Amount: ${amount}
- Description: {description}
- Trigger reason: {trigger_reason or 'Manual submission'}
- Worker activity hours: {activity_hours:.1f}
- Claim history: {claim_history:.1f}
- Fraud indicators: {fraud_probability:.1f}

Return only valid JSON, no extra text.
"""

    ai_response = call_ai_service(prompt)
    try:
        result = json.loads(ai_response)
        fraud_risk = float(result.get("fraud_risk", fraud_probability))
        decision = result.get("decision", "Under Review")
        ai_analysis = result.get("ai_analysis", "AI analysis completed.")
    except Exception:
        fraud_risk = fraud_probability
        if fraud_risk > 65 or amount > 50000:
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
        "ai_analysis": ai_analysis,
        "trigger_reason": trigger_reason,
    }

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
    result = process_claim(claim.amount, claim.description, claim.trigger_reason)
    return result

@app.get("/parametric-check")
def parametric_check():
    weather = fetch_weather_data()
    weather_available = weather.get("available", True)
    rainfall = weather.get("rainfall_mm", 0.0)
    temp = weather.get("temperature", 0.0)
    condition = weather.get("condition", "Unknown")
    triggered = False
    trigger_type = "Normal"
    trigger_value = 0.0
    threshold = 0.0
    status = "Normal"
    action = "No Action Needed"
    trigger_reason = None

    if not weather_available:
        return {
            "triggered": False,
            "condition": "Unavailable",
            "value": 0.0,
            "threshold": 0.0,
            "status": "Unavailable",
            "action": "No Action Needed",
            "weather": {
                "temperature": temp,
                "rainfall_mm": rainfall,
                "condition": condition,
            },
            "ai_insight": "Weather data unavailable. Configure WEATHER_API_KEY in backend/.env.",
            "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
        }

    if rainfall > 50.0:
        triggered = True
        trigger_type = "Rainfall"
        trigger_value = rainfall
        threshold = 50.0
        status = "Triggered"
        action = "Claim Auto-Processed"
        trigger_reason = f"Heavy rainfall detected at {rainfall} mm"
    elif temp > 40.0:
        triggered = True
        trigger_type = "Heatwave"
        trigger_value = temp
        threshold = 40.0
        status = "Triggered"
        action = "Claim Auto-Processed"
        trigger_reason = f"Extreme heat detected at {temp} °C"
    elif temp < 5.0:
        triggered = True
        trigger_type = "Coldwave"
        trigger_value = temp
        threshold = 5.0
        status = "Triggered"
        action = "Claim Auto-Processed"
        trigger_reason = f"Coldwave detected at {temp} °C"

    response = {
        "triggered": triggered,
        "condition": trigger_type,
        "value": trigger_value,
        "threshold": threshold,
        "status": status,
        "action": action,
        "weather": {
            "temperature": temp,
            "rainfall_mm": rainfall,
            "condition": condition,
        },
        "ai_insight": "AI Insight: Monitoring weather conditions for parametric triggers.",
        "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    if triggered:
        claim_payload = process_claim(
            amount=25000.0,
            description=f"Auto parametric claim due to {trigger_type}.",
            trigger_reason=trigger_reason,
        )
        response["claim_id"] = claim_payload["claim_id"]
        response["decision"] = claim_payload["decision"]
        response["claim_ai_analysis"] = claim_payload["ai_analysis"]
        response["reason"] = trigger_reason
        response["fraud_risk"] = claim_payload["fraud_risk"]

    return response

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