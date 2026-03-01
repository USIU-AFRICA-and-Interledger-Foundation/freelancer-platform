export interface Transaction {
  id: string;
  date: Date;
  type: "sent" | "received";
  status: "completed" | "pending" | "processing" | "failed";
  fromCurrency: string;
  toCurrency: string;
  amountSent: number;
  amountReceived: number;
  fee: number;
  recipient?: string;
  sender?: string;
  mpesaNumber?: string;
  transactionHash?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2026-001",
    date: new Date("2026-02-27T10:30:00"),
    type: "received",
    status: "completed",
    fromCurrency: "USD",
    toCurrency: "KES",
    amountSent: 500,
    amountReceived: 65250,
    fee: 12.5,
    sender: "John Smith",
    mpesaNumber: "+254712345678",
    transactionHash: "ILP-4f8a9b2c1d3e5f6a7b8c9d0e1f2a3b4c",
  },
  {
    id: "TXN-2026-002",
    date: new Date("2026-02-26T14:15:00"),
    type: "sent",
    status: "completed",
    fromCurrency: "EUR",
    toCurrency: "KES",
    amountSent: 300,
    amountReceived: 42690,
    fee: 7.5,
    recipient: "Jane Doe",
    mpesaNumber: "+254723456789",
    transactionHash: "ILP-7c5b8a9d2e3f4a5b6c7d8e9f0a1b2c3d",
  },
  {
    id: "TXN-2026-003",
    date: new Date("2026-02-25T09:45:00"),
    type: "received",
    status: "completed",
    fromCurrency: "BTC",
    toCurrency: "KES",
    amountSent: 0.01,
    amountReceived: 54200,
    fee: 542,
    sender: "Crypto Client LLC",
    mpesaNumber: "+254734567890",
    transactionHash: "ILP-9e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
  },
  {
    id: "TXN-2026-004",
    date: new Date("2026-02-24T16:20:00"),
    type: "sent",
    status: "processing",
    fromCurrency: "GBP",
    toCurrency: "KES",
    amountSent: 200,
    amountReceived: 33160,
    fee: 5,
    recipient: "Alice Johnson",
    mpesaNumber: "+254745678901",
    transactionHash: "ILP-2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
  {
    id: "TXN-2026-005",
    date: new Date("2026-02-23T11:00:00"),
    type: "received",
    status: "completed",
    fromCurrency: "USD",
    toCurrency: "KES",
    amountSent: 750,
    amountReceived: 97875,
    fee: 18.75,
    sender: "Tech Corp",
    mpesaNumber: "+254756789012",
    transactionHash: "ILP-5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
  },
  {
    id: "TXN-2026-006",
    date: new Date("2026-02-22T13:30:00"),
    type: "sent",
    status: "completed",
    fromCurrency: "ETH",
    toCurrency: "KES",
    amountSent: 0.5,
    amountReceived: 206000,
    fee: 2060,
    recipient: "Bob Williams",
    mpesaNumber: "+254767890123",
    transactionHash: "ILP-8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f",
  },
  {
    id: "TXN-2026-007",
    date: new Date("2026-02-21T08:15:00"),
    type: "received",
    status: "completed",
    fromCurrency: "USD",
    toCurrency: "KES",
    amountSent: 1000,
    amountReceived: 130500,
    fee: 25,
    sender: "Global Marketplace",
    mpesaNumber: "+254778901234",
    transactionHash: "ILP-1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
  },
  {
    id: "TXN-2026-008",
    date: new Date("2026-02-20T15:45:00"),
    type: "sent",
    status: "failed",
    fromCurrency: "CAD",
    toCurrency: "KES",
    amountSent: 150,
    amountReceived: 0,
    fee: 3.75,
    recipient: "Charlie Brown",
    mpesaNumber: "+254789012345",
    transactionHash: "ILP-6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b",
  },
];

export interface FreelancerProfile {
  name: string;
  email: string;
  phone: string;
  mpesaNumber: string;
  totalReceived: number;
  totalTransactions: number;
  averageRating: number;
  skills: string[];
  joinDate: Date;
}

export const MOCK_FREELANCER: FreelancerProfile = {
  name: "David Kariuki",
  email: "david.kariuki@example.com",
  phone: "+254712345678",
  mpesaNumber: "+254712345678",
  totalReceived: 5420000, // KES
  totalTransactions: 127,
  averageRating: 4.9,
  skills: ["Web Development", "UI/UX Design", "Mobile Apps", "API Integration"],
  joinDate: new Date("2025-06-15"),
};

export interface ClientProfile {
  name: string;
  email: string;
  company: string;
  totalSent: number;
  totalTransactions: number;
  preferredCurrency: string;
  joinDate: Date;
}

export const MOCK_CLIENT: ClientProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  company: "TechStart Inc.",
  totalSent: 12500, // USD equivalent
  totalTransactions: 43,
  preferredCurrency: "USD",
  joinDate: new Date("2025-08-20"),
};
