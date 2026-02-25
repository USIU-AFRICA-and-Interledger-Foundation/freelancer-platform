import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Freelancer Payment Platform | Multi-currency ILP Payments',
  description:
    'A production-ready payment platform enabling multi-currency payments to Kenyan freelancers via M-Pesa using Interledger Protocol and Rafiki.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
