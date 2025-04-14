
import React from 'react';
import { 
  Home, 
  QrCode, 
  CreditCard, 
  History, 
  LineChart, 
  Settings,
  LogOut 
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger 
} from '@/components/ui/sidebar';
import { BottomNav } from './BottomNav';

const sidebarItems = [
  { title: "Dashboard", icon: Home, href: "/" },
  { title: "Scan QR", icon: QrCode, href: "/scan" },
  { title: "My UPI IDs", icon: CreditCard, href: "/upi" },
  { title: "History", icon: History, href: "/history" },
  { title: "Analytics", icon: LineChart, href: "/analytics" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="py-6 px-2">
          <h2 className="text-2xl font-bold text-flexipay-purple flex items-center justify-center">
            <span className="text-flexipay-blue">Flexi</span>Pay
          </h2>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout" className="flex items-center text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-y-auto bg-flexipay-bg">
        <AppSidebar />
        <div className="flex-1 relative overflow-y-auto">
          <div className="container mx-auto px-4 pb-16 md:pb-6">
            <SidebarTrigger className="md:hidden mb-4">
              <span className="sr-only">Toggle Menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </SidebarTrigger>
            <main className="pt-2">
              {children}
            </main>
          </div>
        </div>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
};
