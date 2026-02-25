import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <span className="font-bold text-lg tracking-tight">RafikiPay</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="btn btn-glow text-sm px-5 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-slate-300 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Rafiki Interledger Protocol Integration Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 animate-fade-in stagger-1">
          Global Payments for <br />
          <span className="text-gradient">Kenyan Freelancers</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 animate-fade-in stagger-2">
          Experience frictionless, multi-currency borderless payments. Empowering clients worldwide to hire and pay Kenyan talent directly to M-Pesa.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in stagger-3">
          <Link href="/register" className="btn btn-glow w-full sm:w-auto px-8 py-3 text-lg">
            Start Sending Payments
          </Link>
          <Link href="/freelancers" className="btn btn-outline w-full sm:w-auto px-8 py-3 text-lg">
            I am a Freelancer
          </Link>
        </div>

        {/* Feature Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full text-left animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="card">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Multi-currency Support</h3>
            <p className="text-slate-400">Clients can pay in USD, EUR, GBP, BTC, and more. Rates are calculated in real-time.</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Direct to M-Pesa</h3>
            <p className="text-slate-400">Funds are routed instantly to the freelancer's M-Pesa account via Safaricom Daraja API.</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-slate-400">Powered by the Interledger Protocol (Rafiki), ensuring transparent, almost instantaneous settlement.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
