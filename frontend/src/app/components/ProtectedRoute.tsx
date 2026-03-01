import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "client" | "freelancer" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        // Redirect to the correct dashboard
        if (user.role === "freelancer") {
            return <Navigate to="/freelancer" replace />;
        }
        return <Navigate to="/client" replace />;
    }

    return <>{children}</>;
}
