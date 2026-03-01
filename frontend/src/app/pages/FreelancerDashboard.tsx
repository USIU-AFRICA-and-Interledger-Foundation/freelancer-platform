import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Smartphone,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { usersApi, paymentsApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/currencies";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Transaction {
  id: string;
  source_amount: number;
  destination_amount: number;
  source_currency: string;
  destination_currency: string;
  status: string;
  created_at: string;
  client_email: string;
}

export function FreelancerDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<{
    user: { email: string };
    profile: {
      full_name: string;
      mpesa_phone: string;
      bio: string;
      skills: string[];
      verified: boolean;
    } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, profileRes] = await Promise.all([
          paymentsApi.getTransactions(),
          usersApi.getMe(),
        ]);
        setTransactions(txRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReceived = transactions.reduce((sum, t) => sum + (Number(t.destination_amount) || 0), 0);
  const completed = transactions.filter((t) => t.status === "completed").length;
  const pending = transactions.filter((t) => t.status === "pending" || t.status === "processing").length;

  // Group payments by currency for chart
  const currencyMap: Record<string, number> = {};
  transactions.forEach((t) => {
    currencyMap[t.source_currency] = (currencyMap[t.source_currency] || 0) + (Number(t.destination_amount) || 0);
  });
  const chartData = Object.entries(currencyMap).map(([currency, amount]) => ({ currency, amount }));
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  const displayName = profile?.profile?.full_name || user?.email?.split("@")[0] || "Freelancer";
  const skills = profile?.profile?.skills || [];
  const mpesaPhone = profile?.profile?.mpesa_phone || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Freelancer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayName}</p>
      </div>

      {/* M-Pesa Status Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">M-Pesa Connected</h2>
              <p className="text-green-100">{mpesaPhone || "Not configured in settings"}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-green-100 mb-1">Status</p>
            <div className="flex items-center gap-2">
              {mpesaPhone ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Active</span>
                </>
              ) : (
                <Link to="/settings">
                  <Button size="sm" className="bg-white text-green-700 hover:bg-gray-100">
                    Add M-Pesa
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Earned</span>
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalReceived, "KES")}</div>
          <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Payments</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{transactions.length}</div>
          <p className="text-xs text-gray-500 mt-1">All-time count</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completed</span>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold">{completed}</div>
          <p className="text-xs text-gray-500 mt-1">Successful payments</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pending</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold">{pending}</div>
          <p className="text-xs text-gray-500 mt-1">In progress</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Payments by Currency</h2>
              <p className="text-sm text-gray-600">Breakdown of received payments (KES)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>

          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              No payment data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="currency" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  formatter={(value: number) => formatCurrency(value, "KES")}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Profile & Skills */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profile</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{profile?.user?.email}</p>
              </div>
              {mpesaPhone && (
                <div>
                  <p className="text-gray-600">M-Pesa</p>
                  <p className="font-medium">{mpesaPhone}</p>
                </div>
              )}
              {profile?.profile?.bio && (
                <div>
                  <p className="text-gray-600">Bio</p>
                  <p className="font-medium">{profile.profile.bio}</p>
                </div>
              )}
            </div>
          </Card>

          {skills.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-2">Update Profile</h3>
            <p className="text-sm text-gray-700 mb-4">Keep your skills and M-Pesa number up to date</p>
            <Link to="/settings">
              <Button size="sm" className="w-full">Go to Settings</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Payments Received</h2>
          <Link to="/transactions">
            <Button variant="outline" size="sm">
              View All <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No payments received yet</p>
            <p className="text-sm">Share your M-Pesa number with clients to start getting paid</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.status === "completed" ? "bg-green-100" : "bg-orange-100"}`}>
                    {transaction.status === "completed"
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <Clock className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-medium">From: {transaction.client_email || "Client"}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(transaction.source_amount || 0, transaction.source_currency || "USD")} → KES
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{formatCurrency(transaction.destination_amount || 0, "KES")}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
