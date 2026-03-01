export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  type: "fiat" | "crypto";
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", type: "fiat" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", type: "fiat" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", type: "fiat" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", type: "fiat" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", type: "fiat" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", type: "fiat" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", type: "fiat" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", type: "fiat" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", type: "fiat" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", type: "fiat" },
  { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "₿", type: "crypto" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "Ξ", type: "crypto" },
  { code: "USDT", name: "Tether", symbol: "₮", flag: "₮", type: "crypto" },
  { code: "USDC", name: "USD Coin", symbol: "$", flag: "$", type: "crypto" },
];

// Mock exchange rates to KES (Kenyan Shilling)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 130.5,
  EUR: 142.3,
  GBP: 165.8,
  JPY: 0.89,
  CAD: 95.2,
  AUD: 87.4,
  CHF: 148.9,
  CNY: 18.2,
  INR: 1.58,
  ZAR: 7.3,
  BTC: 5420000.0, // Highly volatile, mock rate
  ETH: 412000.0,
  USDT: 130.5,
  USDC: 130.5,
  KES: 1.0,
};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string = "KES"): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  return (amount * fromRate) / toRate;
}

export function formatCurrency(amount: number | string, currency: string): string {
  const currencyObj = CURRENCIES.find((c) => c.code === currency);
  const symbol = currencyObj?.symbol || currency;
  const numAmount = Number(amount) || 0;

  if (currency === "BTC") {
    return `${symbol}${numAmount.toFixed(8)}`;
  }
  if (currency === "ETH") {
    return `${symbol}${numAmount.toFixed(6)}`;
  }

  return `${symbol}${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateFee(amount: number, currency: string): number {
  // Mock fee calculation: 2.5% for fiat, 1% for crypto
  const currencyObj = CURRENCIES.find((c) => c.code === currency);
  const feePercentage = currencyObj?.type === "crypto" ? 0.01 : 0.025;
  return amount * feePercentage;
}
