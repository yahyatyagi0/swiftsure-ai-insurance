import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getRiskPrediction } from "../../services/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type RiskPrediction = {
  predicted_risk_score: number;
  trend: string;
  explanation: string;
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "Increasing":
      return <TrendingUp className="w-5 h-5 text-red-600" />;
    case "Decreasing":
      return <TrendingDown className="w-5 h-5 text-emerald-600" />;
    case "Stable":
      return <Minus className="w-5 h-5 text-amber-600" />;
    default:
      return null;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "Increasing":
      return "text-red-700";
    case "Decreasing":
      return "text-emerald-700";
    case "Stable":
      return "text-amber-700";
    default:
      return "text-gray-700";
  }
};

export function RiskPredictionCard() {
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getRiskPrediction()
      .then((data) => {
        setPrediction(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load risk prediction.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600">🤖 AI Predicting Future Risk...</p>
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

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔮</span>
        <h3 className="font-semibold text-gray-900">Risk Prediction</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Predicted Risk Score
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-purple-600">
              {prediction?.predicted_risk_score ?? "—"}
            </span>
            {prediction?.trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon(prediction.trend)}
                <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                  {prediction.trend}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            AI Explanation
          </p>
          <p className="text-sm text-gray-700 mt-2">{prediction?.explanation ?? "—"}</p>
        </div>
      </div>
    </Card>
  );
}