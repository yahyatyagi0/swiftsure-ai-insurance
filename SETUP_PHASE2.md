# SwiftSure Phase 2 - Quick Start Guide

## ✅ Frontend Status
- ✓ Dev server running on `http://localhost:5174/`
- ✓ All Phase 2 components integrated
- ✓ No TypeScript errors
- ✓ Ready for testing

## 🚀 Next Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

Once installed, the FastAPI import errors will resolve.

### Step 2: Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload
```

The backend will run on `http://localhost:8000/`

### Step 3: Test API Endpoints
Open in browser or use curl:
- http://localhost:8000/worker-profile
- http://localhost:8000/risk-score
- http://localhost:8000/fraud-check
- http://localhost:8000/ai-recommendations
- http://localhost:8000/risk-prediction
- http://localhost:8000/worker-activity
- http://localhost:8000/risk-trend

### Step 4: View Interactive Dashboard
- Frontend: `http://localhost:5174/`
- Try clicking "Refresh Data" to see AI insights update
- Submit a claim to see the AI analysis card
- Enable "Auto-Refresh" for live updates

---

## 🎯 Phase 2 Features to Test

### 1. Safety Score
- Displays as inverse of risk score (100 - Risk)
- Visual progress bar shows safety level
- Color-coded: Green (70+), Amber (40-70), Red (<40)

### 2. AI Recommendations
- Shows 3 dynamic recommendations
- Updates based on risk assessment
- Blue gradient card with lightbulb icon

### 3. Claim Analysis
- Submit claim → See AI decision
- Shows fraud risk percentage
- Decision: Approved/Under Review/Rejected
- Includes AI explanation

### 4. Worker Profile
- Random realistic worker data
- Status, policy, premium info

### 5. Risk Assessment
- AI Insight banner at top
- Risk score with level indicator
- Fraud probability assessment

### 6. Analytics Charts
- Risk trend over 6 months
- Fraud probability over time
- Worker activity by day

---

## 📊 Architecture

```
Frontend (React/Vite)
├── App.tsx (Main layout with sections)
├── Components/
│   ├── DashboardCards.tsx (↑ Enhanced with Safety Score)
│   ├── AIRecommendations.tsx (↑ NEW)
│   ├── ClaimButton.tsx (↑ Enhanced with analysis)
│   ├── ClaimAnalysisCard.tsx (↑ NEW)
│   ├── Analytics.tsx (Charts)
│   ├── Sidebar.tsx
│   └── TopNavbar.tsx
└── Services/
    └── api.ts (↑ Added new endpoints)

Backend (FastAPI)
├── main.py (↑ Added endpoints)
└── requirements.txt (↑ Added pydantic)

Endpoints:
├── GET /worker-profile (↑ NEW)
├── GET /risk-score (↑ Enhanced)
├── GET /fraud-check (↑ NEW)
├── GET /ai-recommendations (↑ NEW)
├── POST /submit-claim (↑ Enhanced)
├── GET /worker-activity (↑ Enhanced)
├── GET /risk-trend (↑ Enhanced)
└── GET /risk-prediction (↑ NEW)
```

---

## 🧠 AI Risk Formula

```
RiskScore = (0.5 × Activity Risk) + (0.3 × Claim History) + (0.2 × Fraud Probability)

Risk Levels:
- 0-30: Low (Premium: $120/mo)
- 30-60: Medium (Premium: $250/mo)
- 60-100: High (Premium: $450/mo)

Safety Score = 100 - Risk Score
```

---

## 💡 Key Improvements

### Before Phase 2
- Basic demo with random data
- Simple card layout
- No AI insights
- No recommendations
- Basic claim submission

### After Phase 2
- Intelligent risk calculation ✓
- Enhanced dashboard with sections ✓
- AI insight messages ✓
- AI recommendations card ✓
- AI-powered claim analysis ✓
- Safety score with progress bar ✓
- System status indicator ✓
- Better loading states ✓
- Professional layout ✓

---

## 🔗 Local Development

### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Terminal 2: Frontend
```bash
cd frontend/dashboard
npm run dev
```

### Terminal 3: Testing (Optional)
```bash
# Test backend endpoints
curl http://localhost:8000/risk-score | jq
curl http://localhost:8000/ai-recommendations | jq
```

---

## 📱 Response Examples

### Risk Score
```json
{
  "risk_score": 45.3,
  "risk_level": "Medium",
  "recommended_premium": "$250/mo",
  "fraud_probability": 32.5,
  "ai_insight": "Moderate risk detected due to inconsistent activity patterns."
}
```

### AI Recommendations
```json
{
  "recommendations": [
    "Reduce risk by enforcing stricter safety protocols this month.",
    "Fraud probability is within acceptable limits.",
    "Consider premium optimization based on recent stable activity."
  ]
}
```

### Claim Analysis
```json
{
  "claim_id": "CLM-7624",
  "fraud_risk": 28.4,
  "claim_decision": "Approved",
  "ai_analysis": "Claim aligns with standard parameters. Low fraud risk."
}
```

---

## ✨ Pro Tips

1. **Auto-Refresh**: Enable to see live updates every 15 seconds
2. **Risk Trends**: Watch the charts change as you refresh
3. **Claim Testing**: Submit multiple claims to see different decisions
4. **Worker Profiles**: Each refresh loads a new random worker
5. **AI Insights**: Messages change based on risk calculation

---

## 🐛 Troubleshooting

**Frontend won't load**
- Check if port 5174 is available
- Clear state → `npm run dev`

**Backend connection fails**
- Ensure backend is running on port 8000
- Check CORS middleware in main.py

**API calls failing**
- Backend: Install dependencies → `pip install -r requirements.txt`
- Restart both frontend and backend

**Types not working**
- Run: `npm run dev` (Vite hot reload)
- Clear: `rm -rf node_modules && npm install`

---

## 🎉 You're All Set!

Your SwiftSure Phase 2 project is ready. Visit the [PHASE2_UPGRADE.md](./PHASE2_UPGRADE.md) for complete documentation.

**Questions?** Check the code comments in:
- `frontend/dashboard/src/app/components/DashboardCards.tsx`
- `frontend/dashboard/src/app/components/AIRecommendations.tsx`
- `backend/main.py`
