
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BankTransferPage = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpi, setSelectedUpi] = useState(mockUpiIds[0]?.id || '');
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accountNumber !== confirmAccountNumber) {
      toast({
        title: "Account numbers don't match",
        description: "Please check and re-enter account numbers",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Bank transfer initiated",
      description: `₹${amount} sent to ${accountName} (A/C: ${accountNumber.replace(/\d(?=\d{4})/g, "*")})`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Bank Transfer</h1>
          <p className="text-muted-foreground">Transfer money to any bank account</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-flexipay-purple" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Holder Name</Label>
                <Input 
                  id="account-name" 
                  placeholder="Enter account holder name" 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input 
                  id="account-number" 
                  placeholder="Enter account number" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-account-number">Confirm Account Number</Label>
                <Input 
                  id="confirm-account-number" 
                  placeholder="Re-enter account number" 
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input 
                  id="ifsc" 
                  placeholder="Enter IFSC code" 
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  placeholder="Enter amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input 
                  id="note" 
                  placeholder="Add a note" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select UPI ID to pay from</Label>
                <UpiSelector 
                  upiIds={mockUpiIds} 
                  selectedId={selectedUpi} 
                  onSelect={setSelectedUpi} 
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-flexipay-purple to-flexipay-blue text-white hover:opacity-90 dark:from-flexipay-purple/80 dark:to-flexipay-blue/80"
              >
                Transfer Now
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default BankTransferPage;
