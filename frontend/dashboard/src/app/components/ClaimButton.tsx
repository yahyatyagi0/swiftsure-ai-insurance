import { useState } from "react";
import { Button } from "./ui/button";
import { submitClaim } from "../../services/api";
import { ClaimAnalysisCard } from "./ClaimAnalysisCard";

type ClaimAnalysis = {
  claim_id: string;
  fraud_risk: number;
  claim_decision: string;
  ai_analysis: string;
};

export function ClaimButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [claimAnalysis, setClaimAnalysis] = useState<ClaimAnalysis | null>(null);

  const handleSubmit = async () => {
    setStatus("loading");
    setMessage(null);
    setClaimAnalysis(null);

    try {
      const response = await submitClaim();

      setClaimAnalysis({
        claim_id: response.claim_id || "CLM-0000",
        fraud_risk: response.fraud_risk || 0,
        claim_decision: response.claim_decision || "Pending",
        ai_analysis: response.ai_analysis || "Processing...",
      });

      const successMessage = `✅ Claim submitted successfully`;
      setMessage(successMessage);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Claim submission failed. Please try again.");
      setStatus("error");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        if (status === "error") {
          setMessage(null);
        }
      }, 3000);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="w-full bg-[#2563EB] hover:bg-[#1e40af] text-white"
      >
        {status === "loading" ? "🤖 AI Processing Claim..." : "Submit New Claim"}
      </Button>

      {message ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {message}
        </p>
      ) : null}

      {claimAnalysis ? (
        <div className="mt-4">
          <ClaimAnalysisCard data={claimAnalysis} />
        </div>
      ) : null}
    </div>
  );
}
