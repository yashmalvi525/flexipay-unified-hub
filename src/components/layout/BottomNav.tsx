
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, CreditCard, LineChart, Settings, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: History },
  { path: "/upi", label: "UPI", icon: CreditCard },
  { path: "/check-balance", label: "Balance", icon: DollarSign },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const BottomNav = () => {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg dark:bg-slate-900 dark:border-slate-700">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                isActive 
                  ? "text-flexipay-purple dark:text-flexipay-blue" 
                  : "text-gray-500 hover:text-flexipay-purple dark:text-gray-400 dark:hover:text-flexipay-blue"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
