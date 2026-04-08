import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getWorkerProfile, getRiskScore, getFraudCheck } from "../../services/api";
import { Brain } from "lucide-react";

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
  ai_insight: string;
};

type FraudCheck = {
  fraud_probability: string;
  risk_level: string;
  ai_reason: string;
};

function getSafetyScore(riskScore: number | null): number {
  if (riskScore === null) return 0;
  return Math.round(Math.max(0, Math.min(100, 100 - riskScore)));
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
        <p className="text-sm text-gray-600">🤖 AI analyzing real-time worker data...</p>
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
  const safetyScore = getSafetyScore(riskScoreNumber);

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">Dashboard Summary</p>
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
            🔄 Refresh Data
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
            {autoRefresh ? "⏸ Auto-Refresh" : "▶️ Auto-Refresh"}
          </button>
        </div>
      </div>

      {/* AI Insight Banner */}
      {risk?.ai_insight && (
        <Card className="p-4 shadow-sm border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                AI Insight
              </p>
              <p className="text-sm text-gray-700 mt-1">{risk.ai_insight}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Top Section: Worker Profile, Risk Score, Safety Score */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">👤 Worker Profile</h3>
          <p className="text-lg font-bold text-gray-900">{worker?.name ?? "—"}</p>
          <p className="text-sm text-gray-500 mt-2">Status: {worker?.policy_status ?? "—"}</p>
          <p className="text-sm text-gray-500">
            Weekly Premium: ₹{worker?.weekly_premium ?? "—"}
          </p>
        </Card>

        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">⚠️ Risk Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {risk?.risk_score ?? "—"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Level: <span className="font-semibold">{risk?.risk_level ?? "—"}</span>
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Premium: {risk?.recommended_premium ?? "—"}
          </p>
        </Card>

        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">🛡️ Safety Score</h3>
          <p className="text-3xl font-bold text-emerald-600">{safetyScore}</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                safetyScore >= 70
                  ? "bg-emerald-500"
                  : safetyScore >= 40
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${safetyScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {safetyScore >= 70
              ? "Excellent"
              : safetyScore >= 40
              ? "Moderate"
              : "High Risk"}
          </p>
        </Card>
      </div>

      {/* Fraud Risk Card */}
      <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Fraud Detection</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600 mb-2">Fraud Probability</p>
            <p className="text-3xl font-bold text-red-600">{fraud?.fraud_probability ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Risk Level</p>
            <p className="text-lg font-semibold text-gray-900">{fraud?.risk_level ?? "—"}</p>
          </div>
        </div>
        {fraud?.ai_reason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              AI Analysis
            </p>
            <p className="text-sm text-red-700 mt-1">{fraud.ai_reason}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
