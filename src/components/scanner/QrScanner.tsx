
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpiSelector, UpiId } from '../upi/UpiSelector';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCw, Ban, CheckCircle, Smartphone, CameraOff, ArrowLeft } from 'lucide-react';
import Html5QrcodePlugin from '../scanner/Html5QrcodePlugin';

interface QrScannerProps {
  upiIds: UpiId[];
  startImmediately?: boolean;
}

export const QrScanner: React.FC<QrScannerProps> = ({ 
  upiIds,
  startImmediately = false
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpiId, setSelectedUpiId] = useState(upiIds[0]?.id || '');
  const [scanStage, setScanStage] = useState<'scan' | 'confirm'>('scan');
  const [cameraActive, setCameraActive] = useState(startImmediately);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState({ name: 'Merchant', id: 'merchant@upi' });
  const [facingMode, setFacingMode] = useState('environment');
  const { toast } = useToast();
  const scannerRef = useRef<any>(null);
  const initAttemptsRef = useRef(0);

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
            
            // If permissions are granted and we should start immediately, activate camera
            if (result.state === 'granted' && startImmediately) {
              setCameraActive(true);
            }
          };
          
          // If permissions are already granted and we should start immediately, activate camera
          if (result.state === 'granted' && startImmediately) {
            setCameraActive(true);
          }
        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    };
    
    checkCameraPermission();
    
    // Auto-start camera if startImmediately is true
    if (startImmediately) {
      setCameraActive(true);
    }
  }, [startImmediately]);
  
  // Setup auto-retry for camera initialization
  useEffect(() => {
    let retryTimeout: number | undefined;
    
    if (cameraActive && scannerError && initAttemptsRef.current < 3) {
      console.log(`Retry attempt ${initAttemptsRef.current + 1}/3`);
      retryTimeout = window.setTimeout(() => {
        initAttemptsRef.current += 1;
        setScannerError(null);
        if (scannerRef.current) {
          scannerRef.current.restart();
        } else {
          setCameraActive(false);
          setTimeout(() => setCameraActive(true), 100);
        }
      }, 1000);
    }
    
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [cameraActive, scannerError]);
  
  const handleQrCodeScan = (decodedText: string) => {
    console.log('QR code detected:', decodedText);
    
    try {
      const scannedData = decodedText;
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
  };

  const handleQrCodeError = (error: any) => {
    console.error('QR Scanner error:', error);
    
    let errorMessage = 'Could not access camera. Please check permissions.';
    
    if (error.name === "NotAllowedError" || error.message?.includes("Permission denied")) {
      errorMessage = 'Camera access denied. Please enable camera permissions in your browser settings.';
      setCameraPermissionStatus('denied');
    } else if (error.message?.includes('insecure')) {
      errorMessage = 'Camera access requires HTTPS. Please ensure you are using a secure connection.';
    } else if (error.name === "NotFoundError") {
      errorMessage = 'No camera found. Please make sure your device has a camera.';
    } else if (error.name === "NotReadableError") {
      errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
    }
    
    setScannerError(errorMessage);
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
    setCameraActive(true);
    initAttemptsRef.current = 0;
  };

  const retryCamera = () => {
    setScannerError(null);
    initAttemptsRef.current = 0;
    setCameraActive(true);
  };
  
  const startScanner = () => {
    console.log('Starting scanner with facing mode:', facingMode);
    setScannerError(null);
    initAttemptsRef.current = 0;
    setCameraActive(true);
  };
  
  const toggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    console.log('Switching camera to:', newMode);
    setFacingMode(newMode);
    
    // Reset the error state and attempt counter
    setScannerError(null);
    initAttemptsRef.current = 0;
    
    if (cameraActive && scannerRef.current) {
      setCameraActive(false);
      setTimeout(() => {
        setCameraActive(true);
      }, 300);
    }
  };
  
  const cancelScan = () => {
    setCameraActive(false);
    if (scanStage === 'confirm') {
      setScanStage('scan');
    }
  };
  
  // Simulate a scan for testing - this would be removed in production
  const simulateScan = () => {
    handleQrCodeScan('upi://pay?pa=test@merchant.upi&pn=Test%20Merchant&am=599.00');
  };
  
  return (
    <Card className="max-w-md mx-auto bg-white dark:bg-gray-800/95 shadow-md border-none rounded-xl overflow-hidden">
      <CardHeader className="p-4 bg-gradient-to-r from-flexipay-purple/90 to-flexipay-blue/90 text-white">
        <CardTitle className="text-xl text-center">
          {scanStage === 'scan' ? 'Scan QR Code' : 'Confirm Payment'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        {scanStage === 'scan' ? (
          <div className="space-y-4">
            <div className="aspect-square bg-black rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-dashed border-flexipay-purple/50">
              {cameraActive ? (
                <>
                  {!scannerError ? (
                    <div className="w-full h-full relative">
                      <Html5QrcodePlugin
                        fps={10}
                        qrCodeSuccessCallback={handleQrCodeScan}
                        qrCodeErrorCallback={handleQrCodeError}
                        facingMode={facingMode}
                        ref={scannerRef}
                      />
                      
                      {/* Targeting frame overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-4/5 h-4/5 border-2 border-white/90 rounded-lg"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
                      <Ban className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <p className="text-red-400 font-medium mb-2">{scannerError}</p>
                      <Button variant="outline" onClick={retryCamera} className="mt-2 bg-white dark:bg-gray-700 dark:text-white hover:bg-flexipay-purple/10">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Camera
                      </Button>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2 z-20">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                      onClick={toggleCamera}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
                      onClick={cancelScan}
                    >
                      <CameraOff className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <Camera className="h-16 w-16 text-flexipay-purple/80 mx-auto mb-3" />
                  
                  {cameraPermissionStatus === 'denied' ? (
                    <>
                      <p className="text-red-400 font-medium mb-2">Camera access denied</p>
                      <p className="text-gray-300 text-sm mb-4">Please enable camera access in your browser settings</p>
                    </>
                  ) : (
                    <p className="text-gray-300 mb-4">
                      Camera permission required to scan QR codes
                    </p>
                  )}
                  
                  <div className="flex flex-col space-y-2 w-full max-w-[200px]">
                    <Button 
                      onClick={startScanner} 
                      className="bg-flexipay-purple hover:bg-flexipay-purple/90 text-white font-medium"
                      disabled={cameraPermissionStatus === 'denied'}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                    
                    {/* For testing only - don't show in production */}
                    {!startImmediately && (
                      <Button 
                        onClick={simulateScan} 
                        variant="outline"
                        className="bg-transparent border border-white/20 text-gray-300 hover:bg-white/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span>Simulate Scan</span>
                      </Button>
                    )}
                  </div>
                  
                  {cameraPermissionStatus === 'denied' && (
                    <p className="text-xs text-gray-400 mt-2">
                      You'll need to reset permissions in your browser settings
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-flexipay-purple/20 to-flexipay-blue/20 dark:from-flexipay-purple/30 dark:to-flexipay-blue/30 rounded-lg text-center border border-flexipay-purple/20">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-flexipay-purple dark:text-flexipay-light-purple" />
              <h3 className="font-medium text-flexipay-purple dark:text-flexipay-light-purple text-lg">{merchantInfo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full inline-block mt-1">{merchantInfo.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Amount (₹)</label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="dark:bg-gray-700 dark:text-white border-flexipay-purple/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Pay from</label>
              <UpiSelector 
                upiIds={upiIds}
                selectedId={selectedUpiId}
                onSelect={setSelectedUpiId}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Note (Optional)</label>
              <Input 
                value={note} 
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
                className="dark:bg-gray-700 dark:text-white border-flexipay-purple/30"
              />
            </div>
          </div>
        )}
      </CardContent>
      {scanStage === 'confirm' && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button variant="outline" onClick={() => {
            setScanStage('scan');
            setCameraActive(true);
          }} className="flex-1 border-flexipay-purple/30 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-flexipay-purple/10">
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-flexipay-purple to-flexipay-blue hover:opacity-90 text-white flex-1 font-medium" onClick={handlePayment}>
            Pay ₹{amount || '0'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
