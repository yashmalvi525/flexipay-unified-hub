
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from '@/components/ui/input';
import { MoonIcon, SunIcon } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/components/theme/ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SunIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Dark Mode</h3>
        <MoonIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <Switch 
        id="dark-mode" 
        checked={theme === 'dark'} 
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  );
};

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="Alice Smith" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="alice@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+91 9876543210" className="mt-1" />
              </div>
            </div>
            <div className="pt-2">
              <Button className="btn-primary">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ThemeToggle />
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Compact View</h3>
                <p className="text-sm text-muted-foreground">Show less information in lists</p>
              </div>
              <Switch id="compact-view" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Get notified about transactions</p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Transaction Alerts</h3>
                <p className="text-sm text-muted-foreground">Receive SMS alerts for transactions</p>
              </div>
              <Switch id="sms-alerts" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Default UPI Selection</h3>
                <p className="text-sm text-muted-foreground">Always ask which UPI ID to use</p>
              </div>
              <Switch id="always-ask" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
              </div>
              <Switch id="biometric" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
