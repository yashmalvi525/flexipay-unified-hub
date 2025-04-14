
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QrScanner } from '@/components/scanner/QrScanner';
import { mockUpiIds } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, ArrowDown, Scan, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { isPWAInstallable, installPWA } from '@/utils/pwa-utils';

const ScanPage = () => {
  const isMobile = useIsMobile();
  const [canInstall, setCanInstall] = useState(false);
  
  // Check if the app can be installed
  useEffect(() => {
    const checkInstallability = () => {
      const installable = isPWAInstallable();
      setCanInstall(installable);
    };
    
    checkInstallability();
    
    // Listen for changes in installability
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };
    
    document.addEventListener('pwaInstallable', handleBeforeInstallPrompt);
    
    return () => {
      document.removeEventListener('pwaInstallable', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstall = async () => {
    try {
      const installed = await installPWA();
      if (installed) {
        setCanInstall(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in px-2 sm:px-0 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <Scan className="h-6 w-6 mr-2 text-flexipay-neon-purple" />
            <span className="text-gradient-primary">Scan & Pay</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Quick and secure payments with any UPI QR code
          </p>
        </div>
        
        {canInstall && (
          <Card className="bg-gradient-to-br from-flexipay-blue/20 to-flexipay-blue/5 border-flexipay-blue/30 card-hover shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button 
                className="w-full bg-flexipay-blue text-white hover:bg-flexipay-blue/90 font-semibold shadow-sm"
                onClick={handleInstall}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Add to Home Screen</span>
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-flexipay-blue/20 to-flexipay-blue/5 border-flexipay-blue/30 card-hover shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-blue text-white hover:bg-flexipay-blue/90 font-semibold shadow-sm">
                <ArrowUp className="h-4 w-4 mr-2" />
                <span>Pay</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-flexipay-purple/20 to-flexipay-purple/5 border-flexipay-purple/30 card-hover shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-purple text-white hover:bg-flexipay-purple/90 font-semibold shadow-sm">
                <ArrowDown className="h-4 w-4 mr-2" />
                <span>Request</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative overflow-hidden rounded-xl border-2 border-flexipay-neon-purple/40 shadow-lg">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-flexipay-purple/20 to-flexipay-blue/20 rounded-full blur-xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-gradient-to-tr from-flexipay-blue/20 to-flexipay-purple/20 rounded-full blur-xl"></div>
          
          <QrScanner upiIds={mockUpiIds} startImmediately={true} />
        </div>
        
        <div className="text-center text-xs text-muted-foreground px-4 py-2 bg-muted rounded-full inline-block mx-auto">
          Secure QR payments powered by UPI
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanPage;
