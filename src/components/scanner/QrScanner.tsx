
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpiSelector, UpiId } from '../upi/UpiSelector';
import { useToast } from '@/hooks/use-toast';
import QrReader from 'react-qr-scanner';
import { Camera, RefreshCw, Ban } from 'lucide-react';

interface QrScannerProps {
  upiIds: UpiId[];
}

interface ScanResult {
  text: string;
}

export const QrScanner: React.FC<QrScannerProps> = ({ upiIds }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpiId, setSelectedUpiId] = useState(upiIds[0]?.id || '');
  const [scanStage, setScanStage] = useState<'scan' | 'confirm'>('scan');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [merchantInfo, setMerchantInfo] = useState({ name: 'Merchant', id: 'merchant@upi' });
  const { toast } = useToast();
  
  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err);
    setScannerError('Could not access camera. Please check permissions.');
    setCameraActive(false);
    toast({
      title: "Camera Error",
      description: "Could not access camera. Please check permissions.",
      variant: "destructive"
    });
  };
  
  const handleScan = (data: ScanResult | null) => {
    if (data && data.text) {
      console.log('QR code detected:', data.text);
      // In a real app, you would parse the UPI QR code data here
      // For now, we'll simulate that we've found merchant details
      
      // Example QR content: upi://pay?pa=merchant@upi&pn=MerchantName&am=100
      try {
        const scannedData = data.text;
        console.log('Scanned data:', scannedData);
        
        // Simple parsing for demo - in reality, use proper URI parsing
        if (scannedData.includes('upi://pay')) {
          // Parse merchant data
          const merchantId = scannedData.includes('pa=') ? 
            scannedData.split('pa=')[1].split('&')[0] : 'merchant@upi';
          
          const merchantName = scannedData.includes('pn=') ? 
            scannedData.split('pn=')[1].split('&')[0] : 'Merchant';
          
          const scannedAmount = scannedData.includes('am=') ? 
            scannedData.split('am=')[1].split('&')[0] : '';
          
          setMerchantInfo({
            name: decodeURIComponent(merchantName),
            id: merchantId
          });
          
          if (scannedAmount) {
            setAmount(scannedAmount);
          }
          
          // Move to confirmation stage
          setScanStage('confirm');
          setCameraActive(false);
          
          toast({
            title: "QR Code Detected",
            description: `Found payment for ${merchantName}`,
          });
        } else {
          toast({
            title: "Invalid QR Code",
            description: "This doesn't appear to be a UPI QR code",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error parsing QR code:', error);
        toast({
          title: "QR Code Error",
          description: "Could not process the QR code data",
          variant: "destructive"
        });
      }
    }
  };

  const handlePayment = () => {
    // In a real app, this would process the payment
    toast({
      title: "Payment Successful",
      description: `₹${amount} paid to ${merchantInfo.name} using ${selectedUpiId}`,
    });
    
    // Reset the form
    setAmount('');
    setNote('');
    setScanStage('scan');
    setCameraActive(false);
  };

  const retryCamera = () => {
    setScannerError(null);
    setCameraActive(true);
  };
  
  const startScanner = () => {
    setScannerError(null);
    setCameraActive(true);
  };
  
  const cancelScan = () => {
    setCameraActive(false);
    if (scanStage === 'confirm') {
      setScanStage('scan');
    }
  };
  
  // Request camera permissions explicitly on component mount
  useEffect(() => {
    if (cameraActive) {
      // Request camera permission explicitly
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          // Permission granted, but we don't need to do anything with the stream
          // as QrReader will handle camera access
          console.log('Camera permission granted');
          
          // Clean up stream when component unmounts
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        })
        .catch((err) => {
          console.error('Camera permission denied:', err);
          setScannerError('Camera permission denied. Please enable camera access.');
          setCameraActive(false);
          toast({
            title: "Camera Access Denied",
            description: "Please enable camera access in your browser settings",
            variant: "destructive"
          });
        });
    }
  }, [cameraActive, toast]);
  
  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      setCameraActive(false);
    };
  }, []);
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{scanStage === 'scan' ? 'Scan QR Code' : 'Confirm Payment'}</CardTitle>
      </CardHeader>
      <CardContent>
        {scanStage === 'scan' ? (
          <div className="space-y-4">
            <div className="aspect-square bg-black rounded-lg flex items-center justify-center border-2 border-dashed border-muted relative overflow-hidden">
              {cameraActive ? (
                <>
                  {!scannerError ? (
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      constraints={{
                        video: { 
                          facingMode: 'environment',
                          width: { ideal: 1280 },
                          height: { ideal: 720 }
                        }
                      }}
                      className="w-full h-full"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Ban className="h-12 w-12 text-destructive mx-auto mb-2" />
                      <p className="text-destructive font-medium mb-2">{scannerError}</p>
                      <Button variant="outline" onClick={retryCamera} className="mt-2">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Camera
                      </Button>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm z-10"
                    onClick={cancelScan}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="text-center p-6">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Camera permission required to scan QR codes</p>
                  <Button onClick={startScanner} className="btn-primary">
                    Start Camera
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-flexipay-light-purple dark:bg-flexipay-purple/20 rounded-lg text-center">
              <h3 className="font-medium text-flexipay-purple dark:text-flexipay-light-purple">{merchantInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{merchantInfo.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="dark:bg-muted/30"
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
                className="dark:bg-muted/30"
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
