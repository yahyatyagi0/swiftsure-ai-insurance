import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getParametricCheck } from "../../services/api";
import { CloudRain, Thermometer, CheckCircle2, AlertTriangle, Clock3 } from "lucide-react";

type ParametricData = {
  triggered: boolean;
  condition: string;
  value: number;
  threshold: number;
  status: string;
  action: string;
  weather: {
    temperature: number;
    rainfall_mm: number;
    condition: string;
  };
  claim_id?: string;
  decision?: string;
  claim_ai_analysis?: string;
  reason?: string;
  ai_insight?: string;
  last_updated?: string;
};

export function ParametricCard() {
  const [data, setData] = useState<ParametricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getParametricCheck();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch live parametric data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(fetchData, 12000);
    return () => window.clearInterval(interval);
  }, []);

  const statusColor = data?.triggered ? "text-red-700 bg-red-50 border-red-200" : "text-emerald-700 bg-emerald-50 border-emerald-200";

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
            <span>🌍</span> Parametric Monitoring (Live)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Real-time weather triggers and automated parametric claim evaluation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            ● Live Data
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            Auto Trigger Enabled
          </span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
          🌍 Monitoring real-world conditions...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : !data ? (
        <div className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
          No parametric data available.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {(() => {
              const weather = data?.weather ?? { temperature: 0, rainfall_mm: 0, condition: "—" };
              return (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium uppercase tracking-wide">
                      <Thermometer className="w-4 h-4" />
                      Temperature
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{weather.temperature}°C</p>
                    <p className="text-sm text-slate-500 mt-2">Condition: {weather.condition}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium uppercase tracking-wide">
                      <CloudRain className="w-4 h-4" />
                      Rainfall
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{weather.rainfall_mm} mm</p>
                    <p className="text-sm text-slate-500 mt-2">Trigger threshold: 50 mm</p>
                  </div>
                </>
              );
            })()}
            <div className={`p-4 rounded-2xl border ${data?.triggered ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                {data?.triggered ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                Status
              </div>
              <p className={`mt-3 text-3xl font-bold ${data?.triggered ? "text-red-700" : "text-emerald-700"}`}>
                {data?.status ?? "Normal"}
              </p>
              <p className="text-sm text-slate-500 mt-2">Source: OpenWeather</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Live trigger summary</p>
                <span className="text-xs text-slate-500">Updated {data?.last_updated ?? "—"}</span>
              </div>
              <div className="mt-4 text-sm text-slate-600 space-y-2">
                <p>Condition: <span className="font-medium text-slate-900">{data?.condition ?? "—"}</span></p>
                <p>Value: <span className="font-medium text-slate-900">{data?.value ?? 0}</span></p>
                <p>Action: <span className="font-medium text-slate-900">{data?.action ?? "No Action Needed"}</span></p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">AI Insight</p>
              <p className="mt-3 text-sm text-slate-700">{data?.ai_insight ?? "AI insight is available for live parametric events."}</p>

              {data?.triggered && (
                <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">🚨 Auto Claim Initiated</p>
                  <p className="mt-2">Claim ID: <span className="font-medium text-slate-900">{data.claim_id}</span></p>
                  <p>Decision: <span className="font-medium text-slate-900">{data.decision}</span></p>
                  <p>Reason: <span className="font-medium text-slate-900">{data.reason}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
