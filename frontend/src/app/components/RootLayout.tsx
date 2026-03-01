import { Outlet, Link, useLocation, Navigate } from "react-router";
import { Wallet, Send, History, Settings, Home, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { useAuth } from "../context/AuthContext";

export function RootLayout() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  // While loading, don't redirect (ProtectedRoute handles that)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect logged-in users away from login/register
  if (user && isAuth) {
    return <Navigate to={user.role === "freelancer" ? "/freelancer" : "/client"} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster />
      {!isHome && !isAuth && (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">PayBridge</h1>
                  <p className="text-xs text-gray-500">Powered by Interledger</p>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${isHome ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100"
                    }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                {user?.role === "client" && (
                  <Link
                    to="/client"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/client" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                      }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {user?.role === "freelancer" && (
                  <Link
                    to="/freelancer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/freelancer" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
                      }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {user?.role === "client" && (
                  <Link
                    to="/send"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/send" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                      }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Payment</span>
                  </Link>
                )}
                <Link
                  to="/transactions"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/transactions" ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    }`}
                >
                  <History className="w-4 h-4" />
                  <span>Transactions</span>
                </Link>
                <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/settings" ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100"
                    }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 px-3 py-2 rounded-lg bg-gray-50 border">
                      <User className="w-4 h-4" />
                      <span className="max-w-32 truncate">{user.email}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${user.role === "client" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {user.role}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button size="sm">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main>
        <Outlet />
      </main>

      {!isHome && !isAuth && (
        <footer className="border-t bg-white/50 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold">PayBridge</span>
                </div>
                <p className="text-sm text-gray-600">
                  Connecting global clients with Kenyan freelancers through seamless, multi-currency payments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Platform</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Interledger Protocol</li>
                  <li>Rafiki Integration</li>
                  <li>M-Pesa Delivery</li>
                  <li>Multi-Currency</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Help Center</li>
                  <li>API Documentation</li>
                  <li>Contact Us</li>
                  <li>Status</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Compliance</li>
                  <li>Security</li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
              <p>© 2026 PayBridge. Powered by Interledger Protocol and Rafiki.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}