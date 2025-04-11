
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ModeToggle } from '@/components/theme/ModeToggle';
import { AlertTriangle, Download, Smartphone, Check, X, UserPlus, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { isPWAInstallable, installPWA, checkIfPWAInstalled, requestContactsAccess } from '@/utils/pwa-utils';

const SettingsPage = () => {
  const { toast } = useToast();
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasContactsPermission, setHasContactsPermission] = useState(false);
  const [installButtonClicked, setInstallButtonClicked] = useState(false);

  useEffect(() => {
    const checkInstallState = () => {
      const installable = isPWAInstallable();
      const installed = checkIfPWAInstalled();
      
      console.log('PWA status check:', { installable, installed });
      setIsInstallable(installable);
      setIsInstalled(installed);
    };

    checkInstallState();
    
    // Re-check when visibility changes (user might have installed the app)
    document.addEventListener('visibilitychange', checkInstallState);
    
    // Listen for custom events from pwa-utils
    document.addEventListener('pwaInstallable', () => {
      console.log('PWA is installable event received');
      setIsInstallable(true);
    });
    
    document.addEventListener('pwaInstalled', () => {
      console.log('PWA installed event received');
      setIsInstalled(true);
    });
    
    // Check for contacts permission
    const checkContactsPermission = async () => {
      // In a real app, we would check if permission was already granted
      // For this demo, we'll just assume it's not granted initially
      setHasContactsPermission(false);
    };
    
    checkContactsPermission();
    
    // Immediately check if installable on component mount
    setTimeout(checkInstallState, 1000);
    
    return () => {
      document.removeEventListener('visibilitychange', checkInstallState);
      document.removeEventListener('pwaInstallable', () => setIsInstallable(true));
      document.removeEventListener('pwaInstalled', () => setIsInstalled(true));
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('Install button clicked');
    setInstallButtonClicked(true);
    
    try {
      const installed = await installPWA();
      console.log('Installation result:', installed);
      
      if (installed) {
        toast({
          title: "App installed successfully",
          description: "FlexiPay has been added to your home screen",
        });
        setIsInstalled(true);
      } else {
        // For iOS devices, we show a specific toast
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          toast({
            title: "Installation Instructions",
            description: "Tap the share button and select 'Add to Home Screen'",
            duration: 6000,
          });
        } else {
          toast({
            title: "Installation not completed",
            description: "You can install the app later from settings",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast({
        title: "Installation failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      // Reset button clicked state after a delay
      setTimeout(() => setInstallButtonClicked(false), 2000);
    }
  };

  const handleContactsAccessClick = async () => {
    const granted = await requestContactsAccess();
    setHasContactsPermission(granted);
    
    if (granted) {
      toast({
        title: "Contacts access granted",
        description: "You can now pay your contacts easily",
      });
    } else {
      toast({
        title: "Contacts access denied",
        description: "You'll need to grant permission to access contacts",
        variant: "destructive",
      });
    }
  };

  // Detect if user is on iOS
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient-primary">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how FlexiPay looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="color-blind">Color blind mode</Label>
                <p className="text-xs text-muted-foreground">Use alternative color scheme for better accessibility</p>
              </div>
              <Switch id="color-blind" />
            </div>
          </CardContent>
        </Card>
        
        {/* PWA Installation Card */}
        <Card className={isInstalled ? "border-green-500 dark:border-green-700" : "border-flexipay-purple/30"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-flexipay-purple" />
              Install App
              {isInstalled && <Check className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription>
              Install FlexiPay on your device for faster access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isInstalled ? (
              <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>FlexiPay is installed on your device</span>
              </div>
            ) : isIOS ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-start p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                  <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>On iOS: Tap the share button and select "Add to Home Screen" to install FlexiPay.</span>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add FlexiPay to your home screen for a better experience and offline access.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className={`w-full ${isInstalled ? "bg-green-500 hover:bg-green-600" : "bg-flexipay-purple hover:bg-flexipay-purple/90"} relative`}
              onClick={handleInstallClick}
              disabled={(!isInstallable && !isIOS) || isInstalled || installButtonClicked}
            >
              {installButtonClicked ? (
                <>
                  <span className="animate-pulse">Installing...</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {isInstalled ? "Already Installed" : isIOS ? "Add to Home Screen" : "Install App"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Contacts Access Card */}
        <Card className={hasContactsPermission ? "border-green-500 dark:border-green-700" : "border-flexipay-purple/30"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-flexipay-purple" />
              Contact Access
              {hasContactsPermission ? 
                <Check className="h-5 w-5 text-green-500" /> : 
                <X className="h-5 w-5 text-red-500" />
              }
            </CardTitle>
            <CardDescription>
              Allow FlexiPay to access your contacts for easier payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasContactsPermission ? (
              <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>FlexiPay has access to your contacts</span>
              </div>
            ) : (
              <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                <span>Permission required to access your contacts</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-flexipay-purple hover:bg-flexipay-purple/90"
              onClick={handleContactsAccessClick}
              disabled={hasContactsPermission}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {hasContactsPermission ? "Permission Granted" : "Allow Contact Access"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts for transactions</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-reminders">Payment reminders</Label>
                <p className="text-xs text-muted-foreground">Get reminded about pending payments</p>
              </div>
              <Switch id="payment-reminders" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biometric">Biometric authentication</Label>
                <p className="text-xs text-muted-foreground">Use fingerprint or face ID to authorize payments</p>
              </div>
              <Switch id="biometric" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-timeout">Auto-logout after inactivity</Label>
                <p className="text-xs text-muted-foreground">Automatically log out after 15 minutes of inactivity</p>
              </div>
              <Switch id="session-timeout" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4 pb-10">
          <Button variant="link" className="text-muted-foreground text-xs">
            Terms of Service
          </Button>
          <span className="text-muted-foreground text-xs mx-2">•</span>
          <Button variant="link" className="text-muted-foreground text-xs">
            Privacy Policy
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Version 1.0.0
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
