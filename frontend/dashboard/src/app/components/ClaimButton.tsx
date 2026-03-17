import { useState } from "react";
import { Button } from "./ui/button";
import { submitClaim } from "../../services/api";

export function ClaimButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStatus("loading");
    setMessage(null);

    try {
      const response = await submitClaim();

      const successMessage = `✅ Claim submitted successfully (ID: ${response.claim_id ?? "—"})`;
      setMessage(successMessage);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Claim submission failed. Please try again.");
      setStatus("error");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 5000);
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
    </div>
  );
}
