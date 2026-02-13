-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'freelancer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client Profiles
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  full_name VARCHAR(255),
  currency_preference VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Freelancer Profiles
CREATE TABLE IF NOT EXISTS freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  mpesa_phone VARCHAR(20),
  wallet_address VARCHAR(255),
  bio TEXT,
  skills TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Currencies
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(5),
  is_crypto BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE
);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, is_crypto) VALUES
('USD', 'US Dollar', '$', false),
('EUR', 'Euro', '€', false),
('GBP', 'British Pound', '£', false),
('KES', 'Kenyan Shilling', 'KSh', false),
('BTC', 'Bitcoin', '₿', true),
('ETH', 'Ethereum', 'Ξ', true)
ON CONFLICT (code) DO NOTHING;

-- Exchange Rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency VARCHAR(3) REFERENCES currencies(code),
  to_currency VARCHAR(3) REFERENCES currencies(code),
  rate DECIMAL(20, 10) NOT NULL,
  source VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id),
  freelancer_id UUID REFERENCES users(id),
  source_amount DECIMAL(20, 8) NOT NULL,
  source_currency VARCHAR(3) REFERENCES currencies(code),
  destination_amount DECIMAL(20, 2),
  destination_currency VARCHAR(3) REFERENCES currencies(code),
  exchange_rate DECIMAL(20, 10),
  platform_fee DECIMAL(20, 8),
  ilp_fee DECIMAL(20, 8),
  total_fees DECIMAL(20, 8),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  mpesa_transaction_id VARCHAR(50),
  mpesa_receipt VARCHAR(50),
  rafiki_payment_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Status History
CREATE TABLE IF NOT EXISTS transaction_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- M-Pesa Callbacks
CREATE TABLE IF NOT EXISTS mpesa_callbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  result_code INT,
  result_desc TEXT,
  mpesa_receipt VARCHAR(50),
  transaction_date VARCHAR(20),
  phone_number VARCHAR(20),
  amount DECIMAL(20, 2),
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Balances (Internal Ledger/Escrow)
CREATE TABLE IF NOT EXISTS wallet_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  currency VARCHAR(3) REFERENCES currencies(code),
  balance DECIMAL(20, 8) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
