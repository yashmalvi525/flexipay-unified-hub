
import { UpiId } from "@/components/upi/UpiSelector";
import { Transaction } from "@/components/transactions/TransactionCard";
import { subDays, subHours, subMinutes } from 'date-fns';

// Mock UPI IDs
export const mockUpiIds: UpiId[] = [
  { 
    id: "alice@sbi", 
    name: "Personal SBI",
    bank: "State Bank of India",
    isDefault: true,
    lastUsed: "2 hours ago" 
  },
  { 
    id: "alice@hdfc", 
    name: "Salary Account",
    bank: "HDFC Bank",
    lastUsed: "Yesterday" 
  },
  { 
    id: "alice@icici", 
    name: "Savings",
    bank: "ICICI Bank",
    lastUsed: "3 days ago" 
  },
  { 
    id: "alice@paytm", 
    name: "Paytm Wallet",
    bank: "Paytm Payments Bank",
    lastUsed: "1 week ago" 
  },
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "outgoing",
    amount: 1249,
    counterparty: "Amazon",
    upiId: "alice@sbi",
    timestamp: subHours(new Date(), 2),
    note: "Bluetooth headphones"
  },
  {
    id: "t2",
    type: "incoming",
    amount: 5000,
    counterparty: "John Smith",
    upiId: "alice@hdfc",
    timestamp: subHours(new Date(), 5),
    note: "Rent"
  },
  {
    id: "t3",
    type: "outgoing",
    amount: 350,
    counterparty: "Grocery Store",
    upiId: "alice@icici",
    timestamp: subHours(new Date(), 8),
  },
  {
    id: "t4",
    type: "outgoing",
    amount: 120,
    counterparty: "Coffee Shop",
    upiId: "alice@sbi",
    timestamp: subDays(new Date(), 1),
  },
  {
    id: "t5",
    type: "incoming",
    amount: 2500,
    counterparty: "Sarah Jones",
    upiId: "alice@hdfc",
    timestamp: subDays(new Date(), 2),
    note: "Project payment"
  },
  {
    id: "t6",
    type: "outgoing",
    amount: 899,
    counterparty: "Movie Tickets",
    upiId: "alice@paytm",
    timestamp: subDays(new Date(), 3),
  }
];

// Mock balance data for charts
export const mockBalanceData = [
  { date: "Apr 1", balance: 15000 },
  { date: "Apr 2", balance: 14200 },
  { date: "Apr 3", balance: 16700 },
  { date: "Apr 4", balance: 16100 },
  { date: "Apr 5", balance: 18600 },
  { date: "Apr 6", balance: 18100 }
];

// Mock spending by UPI
export const mockSpendingByUpi = [
  { upiId: "alice@sbi", spent: 1369, received: 0 },
  { upiId: "alice@hdfc", spent: 0, received: 7500 },
  { upiId: "alice@icici", spent: 350, received: 0 },
  { upiId: "alice@paytm", spent: 899, received: 0 },
];

// Current total balance
export const mockCurrentBalance = 18100;
