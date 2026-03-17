import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getWorkerProfile, getRiskScore, getFraudCheck } from "../../services/api";

type WorkerProfile = {
  name: string;
  policy_status: string;
  weekly_premium: number;
  risk_score: string;
};

type RiskScore = {
  risk_score: number;
  risk_level: string;
  recommended_premium: number;
};

type FraudCheck = {
  fraud_probability: string;
  risk_level: string;
};

function getAiInsight(score: number | null) {
  if (score === null) return "";
  if (score < 30) return "Low risk → Premium optimized";
  return "High risk → Monitoring required";
}

export function DashboardCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [fraud, setFraud] = useState<FraudCheck | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getWorkerProfile(), getRiskScore(), getFraudCheck()])
      .then(([workerData, riskData, fraudData]) => {
        setWorker(workerData);
        setRisk(riskData);
        setFraud(fraudData);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load dashboard data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = window.setInterval(() => {
      setRefreshKey((key) => key + 1);
    }, 15000);

    return () => window.clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600">🤖 AI Analyzing Worker Data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
        <p className="text-sm text-red-600">{error}</p>
      </Card>
    );
  }

  const riskScoreNumber = risk?.risk_score ?? null;
  const insightText = getAiInsight(riskScoreNumber);
  const isLowRisk = riskScoreNumber !== null && riskScoreNumber < 30;

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">Dashboard summary</p>
          {formattedLastUpdated ? (
            <p className="text-xs text-gray-400">Last updated: {formattedLastUpdated}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            🔄 Refresh data
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh((enabled) => !enabled)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${
              autoRefresh
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {autoRefresh ? "⏸ Auto-refresh" : "▶️ Auto-refresh"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Worker Profile</h3>
          <p className="text-lg font-bold text-gray-900">{worker?.name ?? "—"}</p>
          <p className="text-sm text-gray-500">Status: {worker?.policy_status ?? "—"}</p>
          <p className="text-sm text-gray-500">
            Weekly Premium: ₹{worker?.weekly_premium ?? "—"}
          </p>
        </Card>

        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {risk?.risk_score ?? "—"}
          </p>
          <p className="text-sm text-gray-500">Risk Level: {risk?.risk_level ?? "—"}</p>
          <p
            className={`text-sm font-medium mt-2 ${
              isLowRisk ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {insightText}
          </p>
        </Card>

        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Fraud Risk</h3>
          <p className="text-3xl font-bold text-red-600">
            {fraud?.fraud_probability ?? "—"}
          </p>
          <p className="text-sm text-gray-500">Risk Level: {fraud?.risk_level ?? "—"}</p>
        </Card>
      </div>
    </div>
  );
}
