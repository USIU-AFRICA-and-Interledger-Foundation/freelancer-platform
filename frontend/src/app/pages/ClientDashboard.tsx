import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Send,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { usersApi, paymentsApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/currencies";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  id: string;
  source_amount: number;
  destination_amount: number;
  source_currency: string;
  destination_currency: string;
  status: string;
  created_at: string;
  freelancer_email: string;
}

interface UserProfile {
  user: { email: string; role: string };
  profile: { full_name: string; company_name?: string; currency_preference?: string } | null;
}

export function ClientDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  const totalSent = transactions.reduce((sum, t) => sum + (Number(t.source_amount) || 0), 0);
  const completed = transactions.filter((t) => t.status === "completed").length;
  const pending = transactions.filter((t) => t.status === "pending" || t.status === "processing").length;

  // Build chart data from last 7 transactions by date group
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const amount = transactions
      .filter((t) => new Date(t.created_at).toDateString() === d.toDateString())
      .reduce((s, t) => s + (Number(t.source_amount) || 0), 0);
    return { month: label, amount };
  });

  const displayName = profile?.profile?.full_name || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayName}</p>
      </div>

      {/* Quick Action */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Send a Payment</h2>
            <p className="text-blue-100">
              Pay your freelancers in any currency with instant M-Pesa delivery
            </p>
          </div>
          <Link to="/send">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              <Send className="w-5 h-5 mr-2" />
              Send Money Now
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Sent</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalSent, "USD")}</div>
          <p className="text-xs text-gray-500 mt-1">All-time total</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Transactions</span>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{transactions.length}</div>
          <p className="text-xs text-gray-500 mt-1">All-time count</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
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
        {/* Payment Activity Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Payment Activity</h2>
              <p className="text-sm text-gray-600">Daily payment volume (USD)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Account Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
              {profile?.profile?.company_name && (
                <div>
                  <p className="text-gray-600">Company</p>
                  <p className="font-medium">{profile.profile.company_name}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{profile?.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Preferred Currency</p>
                <p className="font-medium">{profile?.profile?.currency_preference || "USD"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Payments</h2>
          <Link to="/transactions">
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Send className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No payments yet</p>
            <p className="text-sm">Send your first payment to a freelancer!</p>
            <Link to="/send" className="mt-4 inline-block">
              <Button size="sm" className="mt-4">Send Payment</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.status === "completed"
                      ? "bg-green-100"
                      : transaction.status === "processing"
                        ? "bg-blue-100"
                        : "bg-orange-100"
                      }`}
                  >
                    {transaction.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.freelancer_email || "Freelancer"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(transaction.source_amount || 0, transaction.source_currency || "USD")}
                  </p>
                  <p
                    className={`text-sm font-medium ${transaction.status === "completed"
                      ? "text-green-600"
                      : transaction.status === "failed"
                        ? "text-red-500"
                        : "text-orange-500"
                      }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
