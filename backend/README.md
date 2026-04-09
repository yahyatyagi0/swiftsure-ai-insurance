# SwiftSure AI Backend

AI-powered insurance risk analysis backend built with FastAPI.

## Features

- 🤖 AI-powered risk scoring and fraud detection
- 📊 Real-time worker activity monitoring
- 🎯 Intelligent claim processing
- 🔮 Future risk predictions
- 💡 AI-generated recommendations

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run locally:
```bash
uvicorn main:app --reload
```

## Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Set environment variable: `OPENAI_API_KEY`
3. Deploy!

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (optional - app works with fallbacks)

## API Endpoints

- `GET /worker-profile` - Get worker information
- `GET /risk-score` - AI-powered risk analysis
- `GET /fraud-check` - Fraud probability assessment
- `POST /submit-claim` - Process insurance claims
- `GET /ai-recommendations` - Get AI suggestions
- `GET /risk-prediction` - Future risk forecasting
- `GET /risk-trend` - Historical risk data
- `GET /worker-activity` - Activity monitoring