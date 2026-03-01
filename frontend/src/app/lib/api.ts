import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Inject JWT token into every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401 errors, clear auth and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Auth
export const authApi = {
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }),
    register: (data: {
        email: string;
        password: string;
        name: string;
        role: string;
        mpesaPhone?: string;
    }) => api.post("/auth/register", data),
};

// Users
export const usersApi = {
    getMe: () => api.get("/users/me"),
    updateProfile: (data: Record<string, unknown>) =>
        api.put("/users/me/profile", data),
    getFreelancers: () => api.get("/users/freelancers"),
};

// Payments
export const paymentsApi = {
    getTransactions: () => api.get("/payments"),
    createPayment: (data: {
        freelancerId: string;
        amount: number;
        currency: string;
        mpesaNumber?: string;
    }) => api.post("/payments", data),
    getQuote: (amount: number, currency: string, targetCurrency = "KES") =>
        api.post("/payments/quote", { amount, currency, targetCurrency }),
};
