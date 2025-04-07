
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpiSelector, UpiId } from '@/components/upi/UpiSelector';
import { mockUpiIds, mockCurrentBalance } from '@/utils/mock-data';
import { DollarSign, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const CheckBalancePage = () => {
  const [selectedUpi, setSelectedUpi] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);
  const { toast } = useToast();

  const handleCheckBalance = () => {
    if (!selectedUpi) {
      toast({
        title: "No UPI ID selected",
        description: "Please select a UPI ID to check balance",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastChecked(new Date());
      toast({
        title: "Balance retrieved",
        description: "Your balance has been updated successfully",
      });
    }, 1500);
  };

  const selectedUpiDetails = mockUpiIds.find((upi: UpiId) => upi.id === selectedUpi);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Check Balance</h1>
          <p className="text-muted-foreground">View your UPI account balances</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-flexipay-purple" />
              Account Balance
            </CardTitle>
            <CardDescription>Select a UPI ID to check its linked bank account balance</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <UpiSelector
                upiIds={mockUpiIds}
                selectedId={selectedUpi || ""}
                onSelect={(id) => setSelectedUpi(id)}
                variant="cards"
              />
            </div>
            
            <Button 
              onClick={handleCheckBalance}
              disabled={isLoading || !selectedUpi}
              className="w-full bg-gradient-to-r from-flexipay-purple to-flexipay-blue text-white hover:opacity-90 dark:from-flexipay-purple/80 dark:to-flexipay-blue/80"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Checking Balance...</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Check Balance</span>
                </>
              )}
            </Button>
            
            {selectedUpiDetails && (
              <Card className="border-dashed border-2 dark:border-gray-700">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{selectedUpiDetails.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{selectedUpiDetails.id} • {selectedUpiDetails.bank}</p>
                  </div>
                  
                  <div className="pt-2 border-t dark:border-gray-700">
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Current Balance</p>
                    <p className="text-2xl font-bold dark:text-white">₹{mockCurrentBalance.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground space-x-1 dark:text-gray-400">
                    {lastChecked ? (
                      <>
                        <Clock className="h-3 w-3" />
                        <span>Last updated {formatDistanceToNow(lastChecked, { addSuffix: true })}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        <span>Balance not checked yet</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CheckBalancePage;
