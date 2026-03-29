const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://swiftsure-ai-insurance.onrender.com";

export async function getWorkerProfile() {
  const res = await fetch(`${API_BASE}/worker-profile`);
  return res.json();
}

export async function getRiskScore() {
  const res = await fetch(`${API_BASE}/risk-score`);
  return res.json();
}

export async function getFraudCheck() {
  const res = await fetch(`${API_BASE}/fraud-check`);
  return res.json();
}

export async function getAiRecommendations() {
  const res = await fetch(`${API_BASE}/ai-recommendations`);
  return res.json();
}

export async function getRiskPrediction() {
  const res = await fetch(`${API_BASE}/risk-prediction`);
  return res.json();
}

export async function submitClaim(amount: number = 5000, description: string = "Insurance claim") {
  const res = await fetch(`${API_BASE}/submit-claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, description }),
  });
  return res.json();
}

export async function getRiskTrendData() {
  const res = await fetch(`${API_BASE}/risk-trend`);
  return res.json();
}

export async function getWorkerActivityData() {
  const res = await fetch(`${API_BASE}/worker-activity`);
  return res.json();
}
