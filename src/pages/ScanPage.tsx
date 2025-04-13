
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QrScanner } from '@/components/scanner/QrScanner';
import { mockUpiIds } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, ArrowDown, Scan } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const ScanPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    // Inform user about camera permissions on page load
    if (isMobile) {
      const checkPermissions = async () => {
        try {
          if (navigator.permissions && navigator.permissions.query) {
            const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
            
            if (result.state === 'denied') {
              toast({
                title: "Camera Permission Denied",
                description: "Please enable camera access in your browser settings to scan QR codes.",
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          console.error('Error checking camera permission:', error);
        }
      };
      
      checkPermissions();
    }
  }, [isMobile, toast]);
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in px-2 sm:px-0 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
            <Scan className="h-6 w-6 mr-2 text-flexipay-purple dark:text-flexipay-light-purple" />
            <span className="text-gradient-primary dark:text-white">Scan & Pay</span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-300 text-sm sm:text-base">
            Quick and secure payments with any UPI QR code
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-flexipay-blue/20 to-flexipay-blue/5 border-flexipay-blue/30 card-hover dark:from-flexipay-blue/20 dark:to-flexipay-blue/10 dark:border-flexipay-blue/40 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-blue text-white hover:bg-flexipay-blue/90 font-semibold shadow-sm">
                <ArrowUp className="h-4 w-4 mr-2" />
                <span>Pay</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-flexipay-purple/20 to-flexipay-purple/5 border-flexipay-purple/30 card-hover dark:from-flexipay-purple/20 dark:to-flexipay-purple/10 dark:border-flexipay-purple/40 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-purple text-white hover:bg-flexipay-purple/90 font-semibold shadow-sm">
                <ArrowDown className="h-4 w-4 mr-2" />
                <span>Request</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative overflow-hidden rounded-xl border-2 border-flexipay-purple/30 shadow-lg dark:border-flexipay-purple/40">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-flexipay-purple/20 to-flexipay-blue/20 rounded-full blur-xl dark:from-flexipay-purple/30 dark:to-flexipay-blue/30"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-gradient-to-tr from-flexipay-blue/20 to-flexipay-purple/20 rounded-full blur-xl dark:from-flexipay-blue/30 dark:to-flexipay-purple/30"></div>
          
          <QrScanner upiIds={mockUpiIds} />
        </div>
        
        <div className="text-center text-xs text-muted-foreground dark:text-gray-400 px-4 py-2 bg-muted dark:bg-gray-800/70 rounded-full inline-block mx-auto">
          Secure QR payments powered by UPI
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanPage;
