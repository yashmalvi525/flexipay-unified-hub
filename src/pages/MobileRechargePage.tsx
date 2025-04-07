
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const operators = [
  { value: "jio", label: "Jio" },
  { value: "airtel", label: "Airtel" },
  { value: "vi", label: "Vi" },
  { value: "bsnl", label: "BSNL" },
];

const circles = [
  { value: "delhi", label: "Delhi NCR" },
  { value: "mumbai", label: "Mumbai" },
  { value: "karnataka", label: "Karnataka" },
  { value: "tamilnadu", label: "Tamil Nadu" },
  { value: "andhrapradesh", label: "Andhra Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "up", label: "Uttar Pradesh" },
  { value: "gujarat", label: "Gujarat" },
  { value: "wb", label: "West Bengal" },
  { value: "punjab", label: "Punjab" },
];

const MobileRechargePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [circle, setCircle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedUpi, setSelectedUpi] = useState(mockUpiIds[0]?.id || '');
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !operator || !circle || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const operatorName = operators.find(op => op.value === operator)?.label;
    
    toast({
      title: "Recharge initiated",
      description: `₹${amount} recharge for ${operatorName} number ${phoneNumber}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Mobile Recharge</h1>
          <p className="text-muted-foreground">Recharge your prepaid mobile number</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-flexipay-purple" />
                Mobile Recharge
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter 10-digit mobile number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operator">Operator</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger id="operator" className="w-full dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select mobile operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="circle">Circle</Label>
                <Select value={circle} onValueChange={setCircle}>
                  <SelectTrigger id="circle" className="w-full dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select circle" />
                  </SelectTrigger>
                  <SelectContent>
                    {circles.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  placeholder="Enter recharge amount" 
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
                Recharge Now
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MobileRechargePage;
