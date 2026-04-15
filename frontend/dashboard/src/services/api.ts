const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://swiftsure-ai-insurance.onrender.com";

async function fetchJson(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getWorkerProfile() {
  return fetchJson("/worker-profile");
}

export async function getRiskScore() {
  return fetchJson("/risk-score");
}

export async function getFraudCheck() {
  return fetchJson("/fraud-check");
}

export async function getAiRecommendations() {
  return fetchJson("/ai-recommendations");
}

export async function getRiskPrediction() {
  return fetchJson("/risk-prediction");
}

export async function getParametricCheck() {
  return fetchJson("/parametric-check");
}

export async function submitClaim(amount: number = 5000, description: string = "Insurance claim") {
  const res = await fetch(`${API_BASE}/submit-claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, description }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getRiskTrendData() {
  return fetchJson("/risk-trend");
}

export async function getWorkerActivityData() {
  const res = await fetch(`${API_BASE}/worker-activity`);
  return res.json();
}
