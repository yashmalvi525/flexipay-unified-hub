
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TransactionCard, Transaction } from './TransactionCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[220px]"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="incoming">Money Received</SelectItem>
              <SelectItem value="outgoing">Money Sent</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 bg-white text-sm font-medium rounded-md border border-input shadow-sm hover:bg-accent">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced</span>
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
            <Badge variant="outline" className="bg-muted">
              {typeFilter === 'incoming' ? 'Received' : 'Sent'}
              <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => setTypeFilter('all')}>×</button>
            </Badge>
          )}
          
          {upiFilter && (
            <Badge variant="outline" className="bg-muted">
              UPI: {upiFilter}
              <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => setUpiFilter(null)}>×</button>
            </Badge>
          )}
          
          {searchQuery && (
            <Badge variant="outline" className="bg-muted">
              Search: {searchQuery}
              <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => setSearchQuery('')}>×</button>
            </Badge>
          )}
          
          <button 
            onClick={clearFilters} 
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="bg-gradient-to-r from-flexipay-purple/10 to-flexipay-blue/10 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:bg-white">Today</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-white">This Week</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-white">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 pt-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Filter className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground font-medium">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
              {(typeFilter !== 'all' || upiFilter || searchQuery) && (
                <button 
                  onClick={clearFilters}
                  className="mt-3 text-sm text-flexipay-purple hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="today" className="pt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Today's transactions will appear here</p>
          </div>
        </TabsContent>
        <TabsContent value="week" className="pt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>This week's transactions will appear here</p>
          </div>
        </TabsContent>
        <TabsContent value="month" className="pt-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>This month's transactions will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
