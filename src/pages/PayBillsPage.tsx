
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const billCategories = [
  { value: "electricity", label: "Electricity" },
  { value: "water", label: "Water" },
  { value: "gas", label: "Gas" },
  { value: "internet", label: "Internet/Broadband" },
  { value: "dth", label: "DTH/Cable TV" },
  { value: "landline", label: "Landline" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const PayBillsPage = () => {
  const [category, setCategory] = useState("");
  const [billerId, setBillerId] = useState("");
  const [consumerId, setConsumerId] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUpi, setSelectedUpi] = useState(mockUpiIds[0]?.id || "");
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !billerId || !consumerId || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const categoryLabel = billCategories.find(c => c.value === category)?.label;
    
    toast({
      title: "Bill payment initiated",
      description: `₹${amount} paid for ${categoryLabel} bill (Consumer ID: ${consumerId})`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Pay Bills</h1>
          <p className="text-muted-foreground">Pay your utility and service bills</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-flexipay-purple" />
                Bill Payment
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bill-category">Bill Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="bill-category" className="w-full dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select bill category" />
                  </SelectTrigger>
                  <SelectContent>
                    {billCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="biller-id">Biller Name/ID</Label>
                <Input 
                  id="biller-id" 
                  placeholder="Enter biller name or ID" 
                  value={billerId}
                  onChange={(e) => setBillerId(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consumer-id">Consumer Number/ID</Label>
                <Input 
                  id="consumer-id" 
                  placeholder="Enter consumer number" 
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  placeholder="Enter bill amount" 
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
                Pay Bill
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PayBillsPage;
