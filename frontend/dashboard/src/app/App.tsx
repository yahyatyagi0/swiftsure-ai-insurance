import { Sidebar } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import { DashboardCards } from "./components/DashboardCards";
import { AIRecommendations } from "./components/AIRecommendations";
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
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-semibold text-slate-900">SwiftSure AI Insurance Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor worker risk, claim activity, and AI insights in one place.
            </p>
          </header>

          {/* TOP SECTION: Worker Profile, Risk Score, Safety Score */}
          <section>
            <DashboardCards />
          </section>

          {/* MIDDLE SECTION: AI Recommendations */}
          <section>
            <AIRecommendations />
          </section>

          {/* CLAIM & ACTION SECTION */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Claim Management</h2>
              <ClaimButton />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 System Status</h2>
              <div className="p-6 shadow-sm border border-gray-200 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50">
                <h3 className="font-semibold text-emerald-900 mb-3">✓ AI Systems Operational</h3>
                <ul className="space-y-2 text-sm text-emerald-800">
                  <li>• Risk analysis engine active</li>
                  <li>• Fraud detection online</li>
                  <li>• Real-time monitoring enabled</li>
                  <li>• Premium optimization ready</li>
                </ul>
              </div>
            </div>
          </section>

          {/* BOTTOM SECTION: Analytics Charts */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Analytics</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <RiskTrendAnalytics />
              <FraudProbabilityAnalytics />
              <WorkerActivityAnalytics />
            </div>
          </section>

          {/* Footer info */}
          <footer className="text-center text-xs text-gray-500 pt-4">
            <p>SwiftSure Phase 2 • AI-Powered Insurance Risk Intelligence</p>
          </footer>
        </div>
      </main>
    </div>
  );
}


