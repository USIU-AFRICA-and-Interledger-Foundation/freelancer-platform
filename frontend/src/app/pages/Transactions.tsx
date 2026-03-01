import { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle, Filter, Loader2, ArrowUpDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { paymentsApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/currencies";

interface Transaction {
  id: string;
  source_amount: number;
  destination_amount: number;
  source_currency: string;
  destination_currency: string;
  status: string;
  created_at: string;
  client_email: string;
  freelancer_email: string;
}

export function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    paymentsApi.getTransactions()
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((t) => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const counterpart = user?.role === "client" ? t.freelancer_email : t.client_email;
    const matchSearch = !search || counterpart?.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "failed") return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-orange-500" />;
  };

  const statusBadgeClass = (status: string) => {
    if (status === "completed") return "text-green-700 bg-green-100";
    if (status === "failed") return "text-red-700 bg-red-100";
    return "text-orange-700 bg-orange-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-gray-600">All your payment records in one place</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {transactions.filter((t) => t.status === "completed").length}
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {transactions.filter((t) => t.status === "pending" || t.status === "processing").length}
          </div>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-500">
            {transactions.filter((t) => t.status === "failed").length}
          </div>
          <p className="text-sm text-gray-600">Failed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </h2>
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <ArrowUpDown className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((t) => {
              const counterpart = user?.role === "client" ? t.freelancer_email : t.client_email;
              const isOutgoing = user?.role === "client";
              return (
                <div key={t.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.status === "completed" ? "bg-green-100" : t.status === "failed" ? "bg-red-100" : "bg-orange-100"
                      }`}>
                      {statusIcon(t.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{counterpart || "Unknown"}</p>
                        <p className={`font-bold ${isOutgoing ? "text-gray-900" : "text-green-600"}`}>
                          {isOutgoing ? "-" : "+"}{formatCurrency(t.source_amount, t.source_currency)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(t.status)}`}>
                            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{t.id.substring(0, 8)}...</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">→ {formatCurrency(t.destination_amount, "KES")}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(t.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {transactions.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
}
