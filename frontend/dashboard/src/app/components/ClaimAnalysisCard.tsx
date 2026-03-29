import { Card } from "./ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

type ClaimAnalysisData = {
  claim_id: string;
  fraud_risk: number;
  claim_decision: string;
  ai_analysis: string;
};

const getDecisionIcon = (decision: string) => {
  switch (decision) {
    case "Approved":
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    case "Rejected":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "Under Review":
      return <Clock className="w-5 h-5 text-amber-600" />;
    default:
      return null;
  }
};

const getDecisionColor = (decision: string) => {
  switch (decision) {
    case "Approved":
      return "bg-emerald-50 border-emerald-200";
    case "Rejected":
      return "bg-red-50 border-red-200";
    case "Under Review":
      return "bg-amber-50 border-amber-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getDecisionTextColor = (decision: string) => {
  switch (decision) {
    case "Approved":
      return "text-emerald-700";
    case "Rejected":
      return "text-red-700";
    case "Under Review":
      return "text-amber-700";
    default:
      return "text-gray-700";
  }
};

export function ClaimAnalysisCard({ data }: { data: ClaimAnalysisData }) {
  return (
    <Card className={`p-6 shadow-md border rounded-xl ${getDecisionColor(data.claim_decision)}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Claim Analysis</h3>
          <p className="text-xs text-gray-500 mt-1">ID: {data.claim_id}</p>
        </div>
        {getDecisionIcon(data.claim_decision)}
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            AI Decision
          </p>
          <p className={`text-lg font-bold mt-1 ${getDecisionTextColor(data.claim_decision)}`}>
            {data.claim_decision}
          </p>
        </div>

        <div className="p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Fraud Risk Assessment
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    data.fraud_risk > 65
                      ? "bg-red-500"
                      : data.fraud_risk > 30
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(data.fraud_risk, 100)}%` }}
                />
              </div>
            </div>
            <span className="font-bold text-gray-900 min-w-12 text-right">
              {data.fraud_risk}%
            </span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            AI Explanation
          </p>
          <p className="text-sm text-gray-700 mt-2">{data.ai_analysis}</p>
        </div>
      </div>
    </Card>
  );
}
