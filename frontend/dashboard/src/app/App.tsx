import { Sidebar } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import { DashboardCards } from "./components/DashboardCards";
import { ClaimButton } from "./components/ClaimButton";
import {
  RiskTrendAnalytics,
  FraudProbabilityAnalytics,
  WorkerActivityAnalytics,
} from "./components/Analytics";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <TopNavbar />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <header>
            <h1 className="text-3xl font-semibold text-slate-900">SwiftSure AI Insurance Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor worker risk, claim activity, and AI insights in one place.
            </p>
          </header>

          <section>
            <DashboardCards />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <RiskTrendAnalytics />
            <FraudProbabilityAnalytics />
            <WorkerActivityAnalytics />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-1">
              <ClaimButton />
            </div>
            <div className="lg:col-span-1">
              <div className="p-6 shadow-sm border border-gray-200 rounded-xl">
                <h3 className="font-semibold mb-4">AI Insights</h3>
                <p className="text-sm text-gray-600">
                  Drag and drop components to customize your dashboard. Use the buttons above to run an AI risk refresh or submit a claim.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


