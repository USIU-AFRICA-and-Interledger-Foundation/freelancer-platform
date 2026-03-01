import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Info, Smartphone, Shield, Zap, Loader2, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { CURRENCIES, formatCurrency } from "../utils/currencies";
import { paymentsApi, usersApi } from "../lib/api";

interface Freelancer {
  id: string;
  name: string;
  email: string;
  mpesaPhone: string;
  skills: string[];
}

interface Quote {
  destinationAmount: number;
  exchangeRate: number;
  totalFeesSource: number;
  sourceAmount: number;
}

export function SendPayment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    freelancerId: "",
    mpesaNumber: "",
    description: "",
    recipientName: "",
  });

  useEffect(() => {
    usersApi.getFreelancers().then((res) => setFreelancers(res.data)).catch(console.error);
  }, []);

  const selectedFreelancer = freelancers.find((f) => f.id === formData.freelancerId);

  const fetchQuote = async () => {
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) return;
    setLoadingQuote(true);
    try {
      const res = await paymentsApi.getQuote(amount, formData.currency);
      setQuote(res.data);
    } catch {
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) { setError("Enter a valid amount."); return; }
      await fetchQuote();
      setStep(2);
    } else if (step === 2) {
      if (!formData.freelancerId) { setError("Please select a freelancer."); return; }
      const mpesa = formData.mpesaNumber || selectedFreelancer?.mpesaPhone || "";
      if (!mpesa) { setError("M-Pesa number is required."); return; }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const mpesaNumber = formData.mpesaNumber || selectedFreelancer?.mpesaPhone || "";
      await paymentsApi.createPayment({
        freelancerId: formData.freelancerId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        mpesaNumber,
      });
      setStep(4);
      setTimeout(() => navigate("/transactions"), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Payment failed. Please try again.");
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const amount = parseFloat(formData.amount) || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {step} of 4:{" "}
            {step === 1 ? "Amount" : step === 2 ? "Recipient" : step === 3 ? "Review" : "Processing"}
          </span>
          <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Amount */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Enter Payment Amount</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="currency">Select Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span>{currency.flag}</span>
                              <span>{currency.code}</span>
                              <span className="text-gray-500">- {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount to Send</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {CURRENCIES.find((c) => c.code === formData.currency)?.symbol}
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="pl-8 text-2xl h-14"
                        step="0.01"
                        min="0.01"
                      />
                    </div>
                  </div>

                  <Button onClick={handleNext} disabled={!formData.amount || amount <= 0} className="w-full" size="lg">
                    Continue to Recipient Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Recipient */}
            {step === 2 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recipient Details</h2>
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label>Select Freelancer</Label>
                    <Select
                      value={formData.freelancerId}
                      onValueChange={(val) => {
                        const fl = freelancers.find((f) => f.id === val);
                        setFormData({
                          ...formData,
                          freelancerId: val,
                          recipientName: fl?.name || "",
                          mpesaNumber: fl?.mpesaPhone?.replace("+254", "") || "",
                        });
                      }}
                    >
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Choose a freelancer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {freelancers.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{f.name}</span>
                              <span className="text-xs text-gray-500">{f.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mpesaNumber">M-Pesa Phone Number</Label>
                    <div className="flex gap-2 mt-2">
                      <div className="w-20 flex items-center justify-center border rounded-lg bg-gray-50">+254</div>
                      <Input
                        id="mpesaNumber"
                        type="tel"
                        placeholder="712345678"
                        value={formData.mpesaNumber}
                        onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                        maxLength={9}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Pre-filled from freelancer profile if available</p>
                  </div>

                  <Alert>
                    <Smartphone className="w-4 h-4" />
                    <AlertDescription>
                      The recipient will receive an M-Pesa notification on their phone once the payment is processed.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleNext} disabled={!formData.freelancerId} className="w-full" size="lg">
                    Continue to Review <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Review Payment</h2>
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                </div>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">You send:</span>
                        <span className="font-medium">{formatCurrency(amount, formData.currency)}</span>
                      </div>
                      {quote && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fee:</span>
                            <span className="font-medium">{formatCurrency(quote.totalFeesSource || 0, formData.currency)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">{formatCurrency((quote.sourceAmount || amount) + (quote.totalFeesSource || 0), formData.currency)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {quote && (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <h3 className="font-semibold mb-3">Recipient Receives</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount in KES:</span>
                        <span className="font-bold text-2xl text-green-700">
                          {formatCurrency(quote.destinationAmount || 0, "KES")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Rate: 1 {formData.currency} = {formatCurrency(quote.exchangeRate || 0, "KES")}
                      </p>
                    </div>
                  )}

                  {loadingQuote && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">Getting live rate...</span>
                    </div>
                  )}

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Recipient Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Freelancer:</span>
                        <span className="font-medium">{selectedFreelancer?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">M-Pesa:</span>
                        <span className="font-medium">+254{formData.mpesaNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      Your payment is protected with bank-grade encryption and processed through the Interledger Protocol.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleSubmit} className="w-full" size="lg" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <>Confirm & Send Payment <Zap className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Processing */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
                <p className="text-gray-600 mb-6">
                  Your payment is being processed through the Interledger Protocol
                </p>
                <Progress value={80} className="max-w-md mx-auto mb-4" />
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Payment initiated</p>
                  <p>✓ Currency conversion in progress</p>
                  <p className="text-blue-600">⟳ Sending to M-Pesa...</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Redirecting to transactions...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
            <h3 className="font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { n: 1, color: "blue", title: "Enter Amount", desc: "Choose currency & amount" },
                { n: 2, color: "green", title: "Add Recipient", desc: "Select freelancer from your list" },
                { n: 3, color: "purple", title: "Get Live Rate", desc: "ILP converts to KES" },
                { n: 4, color: "orange", title: "Instant Delivery", desc: "Funds sent to M-Pesa" },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <div className={`w-8 h-8 bg-${item.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {item.n}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Why PayBridge?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Lightning Fast</p>
                  <p className="text-xs text-gray-600">Average transfer time under 2 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Secure & Safe</p>
                  <p className="text-xs text-gray-600">Bank-grade encryption</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Direct to M-Pesa</p>
                  <p className="text-xs text-gray-600">No bank account needed</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
