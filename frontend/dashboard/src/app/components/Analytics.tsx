import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { getRiskTrendData, getWorkerActivityData, getFraudCheck } from "../../services/api";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type RiskTrendPoint = { month: string; score: number };
type FraudPoint = { month: string; probability: number };
type WorkerActivityPoint = { day: string; tasks: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function RiskTrendAnalytics() {
  const [riskTrendData, setRiskTrendData] = useState<RiskTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiskTrendData()
      .then((data) => setRiskTrendData(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
      <h3 className="font-semibold mb-4">Risk Trend</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading chart…</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={riskTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#2563EB" fill="#60A5FA" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export function FraudProbabilityAnalytics() {
  const [fraudData, setFraudData] = useState<FraudPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFraudCheck()
      .then((data) => {
        const probability = Number((data.fraud_probability ?? "0").replace("%", ""));
        const points: FraudPoint[] = MONTHS.map((month) => ({ month, probability }));
        setFraudData(points);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
      <h3 className="font-semibold mb-4">Fraud Probability</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading chart…</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={fraudData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="probability" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export function WorkerActivityAnalytics() {
  const [activityData, setActivityData] = useState<WorkerActivityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkerActivityData()
      .then((data) => setActivityData(data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
      <h3 className="font-semibold mb-4">Worker Activity</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading chart…</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
