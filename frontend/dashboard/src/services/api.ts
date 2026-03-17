const API_BASE = "http://127.0.0.1:8000";

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

export async function submitClaim() {
  const res = await fetch(`${API_BASE}/submit-claim`, {
    method: "POST",
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
