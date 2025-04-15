
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import QrReader from 'react-qr-scanner';
import { Camera, RefreshCw, Ban } from 'lucide-react';

interface QrScannerProps {
  upiIds: { id: string; label: string; }[];
}

interface ScanResult {
  text: string;
}

export const QrScanner: React.FC<QrScannerProps> = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err);
    setScannerError('Could not access camera. Please check permissions.');
    toast({
      title: "Camera Error",
      description: "Could not access camera. Please check permissions.",
      variant: "destructive"
    });
  };
  
  const handleScan = (data: ScanResult | null) => {
    if (data && data.text) {
      setScannedData(data.text);
      console.log('Scanned data:', data.text);
    }
  };

  const retryCamera = () => {
    setScannerError(null);
    setCameraActive(true);
    setScannedData(null);
  };
  
  const startScanner = () => {
    setCameraActive(true);
    setScannedData(null);
  };
  
  const cancelScan = () => {
    setCameraActive(false);
    setScannedData(null);
  };
  
  useEffect(() => {
    return () => {
      setCameraActive(false);
    };
  }, []);
  
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative aspect-square bg-flexipay-purple/5 rounded-lg flex items-center justify-center border-2 border-dashed border-flexipay-purple/30 overflow-hidden">
            {cameraActive ? (
              <>
                {!scannerError ? (
                  <div className="relative w-full h-full">
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      constraints={{
                        video: { facingMode: 'environment' }
                      }}
                      className="w-full h-full"
                      style={{ width: '100%' }}
                    />
                    
                    {/* Scanner Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-flexipay-purple rounded-lg relative">
                        {/* Corner decorations */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-flexipay-purple"></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-flexipay-purple"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-flexipay-purple"></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-flexipay-purple"></div>
                        
                        {/* Scanning animation */}
                        <div className="absolute left-0 w-full h-0.5 bg-flexipay-purple/50 animate-scan-line"></div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-flexipay-purple/10 backdrop-blur-sm z-10 text-flexipay-purple border-flexipay-purple/30"
                      onClick={cancelScan}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Ban className="h-12 w-12 text-destructive mx-auto mb-2" />
                    <p className="text-destructive font-medium mb-2">{scannerError}</p>
                    <Button 
                      variant="outline" 
                      onClick={retryCamera} 
                      className="mt-2 border-flexipay-purple/30 text-flexipay-purple"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Camera
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6">
                <Camera className="h-12 w-12 text-flexipay-purple/70 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Scan any UPI QR code to make a payment</p>
                <Button 
                  onClick={startScanner} 
                  className="bg-flexipay-purple hover:bg-flexipay-purple/90"
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>
          
          {/* Scanning status */}
          {cameraActive && !scannerError && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Scanning...
              </p>
            </div>
          )}
          
          {/* Display scanned data */}
          {scannedData && (
            <div className="p-4 bg-flexipay-purple/5 rounded-lg border border-flexipay-purple/30">
              <p className="text-sm font-medium text-flexipay-purple mb-1">Scanned QR Code:</p>
              <p className="text-sm text-muted-foreground break-all">{scannedData}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
