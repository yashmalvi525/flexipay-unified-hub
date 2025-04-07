
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import UpiPage from "./pages/UpiPage";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ContactsPage from "./pages/ContactsPage";
import PayPhonePage from "./pages/PayPhonePage";
import BankTransferPage from "./pages/BankTransferPage";
import PayUpiPage from "./pages/PayUpiPage";
import SelfTransferPage from "./pages/SelfTransferPage";
import PayBillsPage from "./pages/PayBillsPage";
import MobileRechargePage from "./pages/MobileRechargePage";
import CheckBalancePage from "./pages/CheckBalancePage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upi" element={<UpiPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/pay-phone" element={<PayPhonePage />} />
            <Route path="/bank-transfer" element={<BankTransferPage />} />
            <Route path="/pay-upi" element={<PayUpiPage />} />
            <Route path="/self-transfer" element={<SelfTransferPage />} />
            <Route path="/pay-bills" element={<PayBillsPage />} />
            <Route path="/mobile-recharge" element={<MobileRechargePage />} />
            <Route path="/check-balance" element={<CheckBalancePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
