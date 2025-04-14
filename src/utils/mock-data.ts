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

// Mock transactions with detailed sender/receiver information
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "outgoing",
    amount: 1249,
    senderName: "You",
    senderUpiId: "alice@sbi",
    receiverName: "Amazon",
    receiverUpiId: "payments@amazon",
    counterparty: "Amazon",
    upiId: "alice@sbi",
    timestamp: subHours(new Date(), 2),
    note: "Bluetooth headphones"
  },
  {
    id: "t2",
    type: "incoming",
    amount: 5000,
    senderName: "John Smith",
    senderUpiId: "john@okaxis",
    receiverName: "You",
    receiverUpiId: "alice@hdfc",
    counterparty: "John Smith",
    upiId: "alice@hdfc",
    timestamp: subHours(new Date(), 5),
    note: "Rent"
  },
  {
    id: "t3",
    type: "outgoing",
    amount: 350,
    senderName: "You",
    senderUpiId: "alice@icici",
    receiverName: "Grocery Store",
    receiverUpiId: "store@paytm",
    counterparty: "Grocery Store",
    upiId: "alice@icici",
    timestamp: subHours(new Date(), 8),
  },
  {
    id: "t4",
    type: "outgoing",
    amount: 120,
    senderName: "You",
    senderUpiId: "alice@sbi",
    receiverName: "Coffee Shop",
    receiverUpiId: "cafe@ybl",
    counterparty: "Coffee Shop",
    upiId: "alice@sbi",
    timestamp: subDays(new Date(), 1),
  },
  {
    id: "t5",
    type: "incoming",
    amount: 2500,
    senderName: "Sarah Jones",
    senderUpiId: "sarah@icici",
    receiverName: "You",
    receiverUpiId: "alice@hdfc",
    counterparty: "Sarah Jones",
    upiId: "alice@hdfc",
    timestamp: subDays(new Date(), 2),
    note: "Project payment"
  },
  {
    id: "t6",
    type: "outgoing",
    amount: 899,
    senderName: "You",
    senderUpiId: "alice@paytm",
    receiverName: "Movie Tickets",
    receiverUpiId: "booking@ybl",
    counterparty: "Movie Tickets",
    upiId: "alice@paytm",
    timestamp: subDays(new Date(), 3),
  }
];

// Mock balance data for charts
export const mockBalanceData = [
  { date: "Apr 1", amount: 15000 },
  { date: "Apr 2", amount: 14200 },
  { date: "Apr 3", amount: 16700 },
  { date: "Apr 4", amount: 16100 },
  { date: "Apr 5", amount: 18600 },
  { date: "Apr 6", amount: 18100 }
];

// Current total balance
export const mockCurrentBalance = 18100;
