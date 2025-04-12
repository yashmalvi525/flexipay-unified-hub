
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QrScanner } from '@/components/scanner/QrScanner';
import { mockUpiIds } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowUp, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ScanPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in px-2 sm:px-0 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-gradient-primary">Scan & Pay</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Quick and secure payments with any UPI ID</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-flexipay-blue/10 to-flexipay-blue/20 border-flexipay-blue/30 card-hover dark:from-flexipay-blue/5 dark:to-flexipay-blue/10">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-blue text-white hover:bg-flexipay-blue/80">
                <ArrowUp className="h-4 w-4 mr-2" />
                <span>Pay</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-flexipay-purple/10 to-flexipay-purple/20 border-flexipay-purple/30 card-hover dark:from-flexipay-purple/5 dark:to-flexipay-purple/10">
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <Button className="w-full bg-flexipay-purple text-white hover:bg-flexipay-purple/80">
                <ArrowDown className="h-4 w-4 mr-2" />
                <span>Request</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 relative overflow-hidden no-zoom dark:border-flexipay-purple/20">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-flexipay-purple/20 to-flexipay-blue/20 rounded-full blur-xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-gradient-to-tr from-flexipay-blue/20 to-flexipay-purple/20 rounded-full blur-xl"></div>
          
          <CardContent className={isMobile ? "p-2" : "p-4"}>
            <QrScanner upiIds={mockUpiIds} />
          </CardContent>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-flexipay-purple/20">
            <QrCode className="h-5 w-5 text-flexipay-purple dark:text-flexipay-light-purple mr-2" />
            <span className="text-xs font-medium dark:text-white">Position QR in frame</span>
          </div>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground px-4 py-2 bg-muted dark:bg-muted/30 rounded-full inline-block mx-auto">
          Secure payments powered by UPI
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanPage;
