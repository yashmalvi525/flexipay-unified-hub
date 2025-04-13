
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TransactionCard, Transaction } from './TransactionCard';
import { Search, Filter, SlidersHorizontal, Calendar, ArrowDown, ArrowUp, CalendarRange } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface TransactionHistoryProps {
  transactions: Transaction[];
  compactView?: boolean;
  showFullDetails?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions,
  compactView = false,
  showFullDetails = false 
}) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [upiFilter, setUpiFilter] = useState<string | null>(null);
  
  // Extract unique UPI IDs from transactions for filtering
  const uniqueUpiIds = Array.from(new Set([
    ...transactions.map(t => t.senderUpiId || t.upiId),
    ...transactions.map(t => t.receiverUpiId)
  ])).filter(Boolean);

  const filteredTransactions = transactions
    .filter(t => {
      if (typeFilter === 'incoming') return t.type === 'incoming';
      if (typeFilter === 'outgoing') return t.type === 'outgoing';
      return true;
    })
    .filter(t => {
      if (!upiFilter) return true;
      return t.senderUpiId === upiFilter || t.receiverUpiId === upiFilter || t.upiId === upiFilter;
    })
    .filter(t => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      
      // Enhanced search to include all transaction details
      return (
        (t.senderName && t.senderName.toLowerCase().includes(query)) ||
        (t.senderUpiId && t.senderUpiId.toLowerCase().includes(query)) ||
        (t.receiverName && t.receiverName.toLowerCase().includes(query)) ||
        (t.receiverUpiId && t.receiverUpiId.toLowerCase().includes(query)) ||
        (t.counterparty && t.counterparty.toLowerCase().includes(query)) ||
        (t.upiId && t.upiId.toLowerCase().includes(query)) ||
        (t.note && t.note.toLowerCase().includes(query))
      );
    });

  const clearFilters = () => {
    setTypeFilter('all');
    setUpiFilter(null);
    setSearchQuery('');
  };

  // Display only basic filter and fewer transactions in compact view
  if (compactView) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium dark:text-white flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-flexipay-purple" />
            Recent Transactions
          </h2>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 dark:text-white border-flexipay-purple/30">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="incoming">Received</SelectItem>
              <SelectItem value="outgoing">Sent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          {filteredTransactions.slice(0, 5).map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} showFullDetails={showFullDetails} />
          ))}
        </div>
      </div>
    );
  }

  // Full transaction history view
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <CalendarRange className="h-5 w-5 mr-2 text-flexipay-purple dark:text-flexipay-light-purple" />
          Transaction History
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-flexipay-purple dark:text-flexipay-light-purple" />
            <Input 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[220px] bg-white dark:bg-gray-800 dark:text-white border-flexipay-purple/30 focus:border-flexipay-purple/50"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 dark:text-white border-flexipay-purple/30">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                All Transactions
              </SelectItem>
              <SelectItem value="incoming" className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-2 text-green-500" />
                Money Received
              </SelectItem>
              <SelectItem value="outgoing" className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
                Money Sent
              </SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border-flexipay-purple/30 hover:bg-flexipay-purple/10 dark:text-white">
                <SlidersHorizontal className="h-4 w-4 text-flexipay-purple dark:text-flexipay-light-purple" />
                <span>Advanced</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>Filter by UPI ID</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setUpiFilter(null)}>
                All UPI IDs
              </DropdownMenuItem>
              {uniqueUpiIds.map(id => (
                <DropdownMenuItem key={id} onClick={() => setUpiFilter(id)}>
                  {id}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Active filters display */}
      {(typeFilter !== 'all' || upiFilter || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {typeFilter !== 'all' && (
            <Badge className="bg-flexipay-purple text-white dark:bg-flexipay-purple dark:text-white px-3 py-1">
              {typeFilter === 'incoming' ? 'Received' : 'Sent'}
              <button className="ml-1.5 text-white hover:bg-white/20 rounded-full h-4 w-4 inline-flex items-center justify-center" onClick={() => setTypeFilter('all')}>×</button>
            </Badge>
          )}
          
          {upiFilter && (
            <Badge className="bg-flexipay-blue text-white dark:bg-flexipay-blue dark:text-white px-3 py-1">
              UPI: {upiFilter}
              <button className="ml-1.5 text-white hover:bg-white/20 rounded-full h-4 w-4 inline-flex items-center justify-center" onClick={() => setUpiFilter(null)}>×</button>
            </Badge>
          )}
          
          {searchQuery && (
            <Badge className="bg-gray-700 text-white dark:bg-gray-700 dark:text-white px-3 py-1">
              Search: {searchQuery}
              <button className="ml-1.5 text-white hover:bg-white/20 rounded-full h-4 w-4 inline-flex items-center justify-center" onClick={() => setSearchQuery('')}>×</button>
            </Badge>
          )}
          
          <button 
            onClick={clearFilters} 
            className="text-xs text-flexipay-purple hover:text-flexipay-purple/80 dark:text-flexipay-light-purple dark:hover:text-flexipay-light-purple/80 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gradient-to-r from-flexipay-purple/20 to-flexipay-blue/20 dark:from-flexipay-purple/30 dark:to-flexipay-blue/30 p-1 w-full">
          <TabsTrigger 
            value="all" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-flexipay-purple dark:data-[state=active]:text-flexipay-purple dark:data-[state=active]:bg-gray-900 text-gray-700 dark:text-white font-medium"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="today" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-flexipay-purple dark:data-[state=active]:text-flexipay-purple dark:data-[state=active]:bg-gray-900 text-gray-700 dark:text-white font-medium"
          >
            Today
          </TabsTrigger>
          <TabsTrigger 
            value="week" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-flexipay-purple dark:data-[state=active]:text-flexipay-purple dark:data-[state=active]:bg-gray-900 text-gray-700 dark:text-white font-medium"
          >
            Week
          </TabsTrigger>
          <TabsTrigger 
            value="month" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-flexipay-purple dark:data-[state=active]:text-flexipay-purple dark:data-[state=active]:bg-gray-900 text-gray-700 dark:text-white font-medium"
          >
            Month
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 pt-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} showFullDetails={showFullDetails} />
            ))
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/70 dark:to-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700">
              <Filter className="mx-auto h-12 w-12 text-flexipay-purple/40 dark:text-flexipay-purple/30 mb-2" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">No transactions found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters</p>
              {(typeFilter !== 'all' || upiFilter || searchQuery) && (
                <button 
                  onClick={clearFilters}
                  className="mt-3 px-4 py-1.5 bg-flexipay-purple/10 hover:bg-flexipay-purple/20 text-sm text-flexipay-purple dark:text-flexipay-light-purple rounded-full"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="today" className="pt-4">
          <div className="text-center py-8 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/70 dark:to-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="mx-auto h-12 w-12 text-flexipay-purple/40 dark:text-flexipay-purple/30 mb-2" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Today's transactions</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No transactions found for today</p>
          </div>
        </TabsContent>
        <TabsContent value="week" className="pt-4">
          <div className="text-center py-8 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/70 dark:to-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="mx-auto h-12 w-12 text-flexipay-purple/40 dark:text-flexipay-purple/30 mb-2" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">This week's transactions</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No transactions found for this week</p>
          </div>
        </TabsContent>
        <TabsContent value="month" className="pt-4">
          <div className="text-center py-8 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/70 dark:to-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="mx-auto h-12 w-12 text-flexipay-purple/40 dark:text-flexipay-purple/30 mb-2" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">This month's transactions</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No transactions found for this month</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
