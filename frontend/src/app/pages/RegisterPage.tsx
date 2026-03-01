import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Wallet, Eye, EyeOff, Loader2, User, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<"client" | "freelancer">("client");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mpesaPhone: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (role === "freelancer" && !form.mpesaPhone) {
            setError("M-Pesa phone number is required for freelancers.");
            return;
        }

        setLoading(true);
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role,
                mpesaPhone: role === "freelancer" ? `+254${form.mpesaPhone}` : undefined,
            });
            navigate(role === "freelancer" ? "/freelancer" : "/client");
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message;
            setError(msg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">PayBridge</h1>
                        <p className="text-xs text-gray-500">Powered by Interledger</p>
                    </div>
                </div>

                <Card className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1">Create your account</h2>
                        <p className="text-gray-600 text-sm">Join thousands of users on PayBridge</p>
                    </div>

                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole("client")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "client"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Briefcase className="w-6 h-6" />
                            <span className="font-semibold text-sm">I'm a Client</span>
                            <span className="text-xs text-gray-500">I want to send payments</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("freelancer")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "freelancer"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="font-semibold text-sm">I'm a Freelancer</span>
                            <span className="text-xs text-gray-500">I want to receive payments</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="mt-2"
                            />
                        </div>

                        {role === "freelancer" && (
                            <div>
                                <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                                <div className="flex gap-2 mt-2">
                                    <div className="w-20 flex items-center justify-center border rounded-lg bg-gray-50 text-sm font-medium">
                                        +254
                                    </div>
                                    <Input
                                        id="mpesaPhone"
                                        type="tel"
                                        placeholder="712345678"
                                        value={form.mpesaPhone}
                                        onChange={(e) => setForm({ ...form, mpesaPhone: e.target.value })}
                                        maxLength={9}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">9-digit number without country code</p>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-2">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Repeat your password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                                className="mt-2"
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
