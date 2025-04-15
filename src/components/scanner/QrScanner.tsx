
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpiSelector, UpiId } from '../upi/UpiSelector';
import { useToast } from '@/hooks/use-toast';

interface QrScannerProps {
  upiIds: UpiId[];
}

export const QrScanner: React.FC<QrScannerProps> = ({ upiIds }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpiId, setSelectedUpiId] = useState(upiIds[0]?.id || '');
  const [scanStage, setScanStage] = useState<'scan' | 'confirm'>('scan');
  const { toast } = useToast();
  
  const handleScan = () => {
    // In a real app, this would process the QR code scan
    setScanStage('confirm');
  };
  
  const handlePayment = () => {
    // In a real app, this would process the payment
    toast({
      title: "Payment Successful",
      description: `₹${amount} paid to Merchant using ${selectedUpiId}`,
    });
    
    // Reset the form
    setAmount('');
    setNote('');
    setScanStage('scan');
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {scanStage === 'scan' ? (
          <div className="space-y-4">
            <div className="aspect-square bg-flexipay-light-gray rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center">
                <p className="text-muted-foreground">Position QR code in the frame</p>
                {/* In a real app, this would be a camera view */}
                <Button onClick={handleScan} className="btn-primary mt-4">
                  Simulate Scan
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-flexipay-light-purple rounded-lg text-center">
              <h3 className="font-medium text-flexipay-purple">Merchant</h3>
              <p className="text-sm text-muted-foreground">merchant@upi</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Pay from</label>
              <UpiSelector 
                upiIds={upiIds}
                selectedId={selectedUpiId}
                onSelect={setSelectedUpiId}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Note (Optional)</label>
              <Input 
                value={note} 
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
              />
            </div>
          </div>
        )}
      </CardContent>
      {scanStage === 'confirm' && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setScanStage('scan')} className="flex-1">
            Cancel
          </Button>
          <Button className="btn-primary flex-1" onClick={handlePayment}>
            Pay ₹{amount || '0'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
