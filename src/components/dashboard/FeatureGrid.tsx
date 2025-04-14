
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, Phone, Building, AtSign, RefreshCw, Receipt, Smartphone } from 'lucide-react';

interface FeatureButton {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}

const featureButtons: FeatureButton[] = [
  {
    id: 'scan-qr',
    icon: QrCode,
    label: 'Scan any QR',
    href: '/scan',
    color: '#33C3F0'
  },
  {
    id: 'pay-contacts',
    icon: Users,
    label: 'Pay contacts',
    href: '/contacts',
    color: '#c4a5ff'
  },
  {
    id: 'pay-phone',
    icon: Phone,
    label: 'Pay phone',
    href: '/pay-phone',
    color: '#33C3F0'
  },
  {
    id: 'bank-transfer',
    icon: Building,
    label: 'Bank transfer',
    href: '/bank-transfer',
    color: '#9370DB'
  },
  {
    id: 'pay-upi',
    icon: AtSign,
    label: 'Pay UPI ID',
    href: '/pay-upi',
    color: '#c4a5ff'
  },
  {
    id: 'self-transfer',
    icon: RefreshCw,
    label: 'Self transfer',
    href: '/self-transfer',
    color: '#9370DB'
  },
  {
    id: 'pay-bills',
    icon: Receipt,
    label: 'Pay bills',
    href: '/pay-bills',
    color: '#33C3F0'
  },
  {
    id: 'mobile-recharge',
    icon: Smartphone,
    label: 'Mobile recharge',
    href: '/mobile-recharge',
    color: '#9370DB'
  }
];

export const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
      {featureButtons.map((button) => (
        <Link 
          key={button.id} 
          to={button.href}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="relative">
            {/* Pulsing background */}
            <div className="absolute inset-0 rounded-full bg-flexipay-dark-card opacity-80"></div>
            
            {/* Glow ring */}
            <div 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-flexipay-dark-card relative overflow-hidden group-hover:scale-105 transition-all duration-300"
              style={{
                boxShadow: `0 0 8px 1px ${button.color}40`,
              }}
            >
              {/* Gradient border effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" 
                style={{
                  background: `linear-gradient(135deg, ${button.color}80, transparent)`,
                }}
              ></div>
              
              <button.icon 
                size={22} 
                className="relative z-10 text-white group-hover:text-white transition-colors duration-300" 
                style={{color: button.color}}
              />
            </div>
          </div>
          <span className="text-xs md:text-sm mt-1 text-white/90 font-medium text-center max-w-[70px] truncate">
            {button.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
