import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ClientDashboard } from "./pages/ClientDashboard";
import { FreelancerDashboard } from "./pages/FreelancerDashboard";
import { SendPayment } from "./pages/SendPayment";
import { Transactions } from "./pages/Transactions";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      {
        path: "client",
        element: (
          <ProtectedRoute requiredRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "freelancer",
        element: (
          <ProtectedRoute requiredRole="freelancer">
            <FreelancerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "send",
        element: (
          <ProtectedRoute requiredRole="client">
            <SendPayment />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
