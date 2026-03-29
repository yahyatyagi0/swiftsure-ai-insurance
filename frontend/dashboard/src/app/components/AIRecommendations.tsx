import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getAiRecommendations } from "../../services/api";
import { Lightbulb } from "lucide-react";

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAiRecommendations()
      .then((data) => {
        setRecommendations(data.recommendations || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load recommendations.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">🧠 AI Recommendations</h3>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Analyzing data...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : recommendations.length > 0 ? (
        <ul className="space-y-3">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="text-indigo-600 font-bold mt-0.5">→</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No recommendations available.</p>
      )}
    </Card>
  );
}
