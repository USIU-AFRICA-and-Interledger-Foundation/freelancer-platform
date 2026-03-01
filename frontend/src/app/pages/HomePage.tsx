import { Link } from "react-router";
import {
  ArrowRight,
  Wallet,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Smartphone,
  Check,
  Send,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">Powered by Interledger Protocol & Rafiki</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Global Payments to Kenyan Freelancers,{" "}
              <span className="text-green-300">Simplified</span>
            </h1>

            <p className="text-xl mb-8 text-blue-100">
              Pay in any currency (USD, EUR, BTC, ETH) with automatic conversion and instant
              delivery to M-Pesa accounts. Fast, secure, and transparent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/client">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 w-full sm:w-auto">
                  Send Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/freelancer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Receive Payments
                  <Wallet className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold mb-1">150+</div>
                <div className="text-sm text-blue-200">Countries Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">$50M+</div>
                <div className="text-sm text-blue-200">Transferred</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">&lt;2min</div>
                <div className="text-sm text-blue-200">Average Transfer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose PayBridge?</h2>
            <p className="text-xl text-gray-600">
              Built on cutting-edge technology for seamless cross-border payments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Currency Support</h3>
              <p className="text-gray-600 mb-4">
                Accept payments in USD, EUR, GBP, BTC, ETH, and 50+ other currencies with real-time
                conversion rates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Real-time exchange rates</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Crypto support (BTC, ETH)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">M-Pesa Integration</h3>
              <p className="text-gray-600 mb-4">
                Automatic delivery to M-Pesa mobile wallets. Freelancers receive funds instantly in
                Kenyan Shillings.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant mobile delivery</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Auto KES conversion</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interledger Protocol</h3>
              <p className="text-gray-600 mb-4">
                Powered by Rafiki and ILP for fast, low-cost transfers across different payment
                networks and currencies.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Low transaction fees</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Fast settlement</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-level encryption and compliance with international payment standards.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>PCI DSS compliant</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 mb-4">
                Know exactly what you're paying with upfront fees and real exchange rates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>No hidden charges</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Live rate preview</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
              <p className="text-gray-600 mb-4">
                Simple API for platforms and marketplaces to integrate PayBridge into their workflow.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>REST API available</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Developer friendly</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to send payments globally</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Select Currency</h3>
                  <p className="text-gray-600">
                    Choose from 50+ currencies including USD, EUR, BTC, and ETH
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-400" />
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">Auto Conversion</h3>
                  <p className="text-gray-600">
                    Interledger converts to KES at the best available rate
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 -translate-x-1/2">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400" />
                </div>
              </div>

              <div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">M-Pesa Delivery</h3>
                  <p className="text-gray-600">
                    Funds delivered instantly to freelancer's M-Pesa account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/send">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Sending Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of clients and freelancers using PayBridge for seamless payments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 w-full sm:w-auto">
                I'm a Client
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/freelancer">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                I'm a Freelancer
                <Wallet className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}