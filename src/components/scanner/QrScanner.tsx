
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpiSelector, UpiId } from '../upi/UpiSelector';
import { useToast } from '@/hooks/use-toast';
import QrReader from 'react-qr-scanner';
import { Camera, RefreshCw, Ban, CheckCircle } from 'lucide-react';

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
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState({ name: 'Merchant', id: 'merchant@upi' });
  const { toast } = useToast();

  // Detect if user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      console.log('Device detected as:', isMobile ? 'mobile' : 'desktop');
      setIsMobileDevice(isMobile);
    };
    
    checkMobile();
  }, []);
  
  // Check camera permissions when component mounts
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Check if the browser supports the permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          console.log('Camera permission status:', result.state);
          setCameraPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          
          // Listen for permission changes
          result.onchange = () => {
            console.log('Camera permission changed to:', result.state);
            setCameraPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          };
        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    };
    
    checkCameraPermission();
  }, []);
  
  const handleError = useCallback((err: Error) => {
    console.error('QR Scanner error:', err);
    
    let errorMessage = 'Could not access camera. Please check permissions.';
    
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMessage = 'Camera access denied. Please enable camera permissions in your browser settings.';
      setCameraPermissionStatus('denied');
    } else if (err.name === 'NotFoundError') {
      errorMessage = 'No camera found. Please make sure your device has a camera.';
    } else if (err.name === 'NotReadableError') {
      errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
    } else if (err.name === 'AbortError') {
      errorMessage = 'Camera initialization was aborted. Please try again.';
    }
    
    setScannerError(errorMessage);
    setCameraActive(false);
    
    toast({
      title: "Camera Error",
      description: errorMessage,
      variant: "destructive"
    });
  }, [toast]);
  
  const handleScan = useCallback((data: ScanResult | null) => {
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
  }, [toast]);

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
    console.log('Starting scanner...');
    setScannerError(null);
    setCameraActive(true);
    
    // Request camera permission explicitly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: isMobileDevice ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      .then(stream => {
        console.log('Camera permission granted, stream obtained');
        // We don't need to do anything with the stream here as QrReader will handle it
        // Just clean up the stream when not needed
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(err => {
        console.error('Failed to get camera permission:', err);
        handleError(err);
      });
    } else {
      console.error('getUserMedia not supported in this browser');
      setScannerError('Camera access is not supported in this browser. Please try a different browser.');
      setCameraActive(false);
    }
  };
  
  const cancelScan = () => {
    setCameraActive(false);
    if (scanStage === 'confirm') {
      setScanStage('scan');
    }
  };
  
  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      if (cameraActive) {
        console.log('Cleaning up camera on unmount');
        setCameraActive(false);
      }
    };
  }, [cameraActive]);
  
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
                          facingMode: isMobileDevice ? 'environment' : 'user',
                          width: { ideal: 1280 },
                          height: { ideal: 720 },
                          aspectRatio: 1
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
                  
                  {cameraPermissionStatus === 'denied' ? (
                    <>
                      <p className="text-destructive font-medium mb-2">Camera access denied</p>
                      <p className="text-muted-foreground text-sm mb-4">Please enable camera access in your browser settings</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      Camera permission required to scan QR codes
                    </p>
                  )}
                  
                  <Button 
                    onClick={startScanner} 
                    className="btn-primary"
                    disabled={cameraPermissionStatus === 'denied'}
                  >
                    Start Camera
                  </Button>
                  
                  {cameraPermissionStatus === 'denied' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      You'll need to reset permissions in your browser settings
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-flexipay-light-purple dark:bg-flexipay-purple/20 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-flexipay-purple dark:text-flexipay-light-purple" />
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
