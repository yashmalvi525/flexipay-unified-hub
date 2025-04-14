
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, Phone, Building, AtSign, RefreshCw, Receipt, Smartphone } from 'lucide-react';

interface FeatureButton {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
  bgColor: string;
}

const featureButtons: FeatureButton[] = [
  {
    id: 'scan-qr',
    icon: QrCode,
    label: 'Scan any QR',
    href: '/scan',
    color: '#6E59A5',
    bgColor: '#E5DEFF'
  },
  {
    id: 'pay-contacts',
    icon: Users,
    label: 'Pay contacts',
    href: '/contacts',
    color: '#9b87f5',
    bgColor: '#F1F0FB'
  },
  {
    id: 'pay-phone',
    icon: Phone,
    label: 'Pay phone',
    href: '/pay-phone',
    color: '#33C3F0',
    bgColor: '#D3E4FD'
  },
  {
    id: 'bank-transfer',
    icon: Building,
    label: 'Bank transfer',
    href: '/bank-transfer',
    color: '#6E59A5',
    bgColor: '#E5DEFF'
  },
  {
    id: 'pay-upi',
    icon: AtSign,
    label: 'Pay UPI ID',
    href: '/pay-upi',
    color: '#9b87f5',
    bgColor: '#F1F0FB'
  },
  {
    id: 'self-transfer',
    icon: RefreshCw,
    label: 'Self transfer',
    href: '/self-transfer',
    color: '#33C3F0',
    bgColor: '#D3E4FD'
  },
  {
    id: 'pay-bills',
    icon: Receipt,
    label: 'Pay bills',
    href: '/pay-bills',
    color: '#6E59A5',
    bgColor: '#E5DEFF'
  },
  {
    id: 'mobile-recharge',
    icon: Smartphone,
    label: 'Mobile recharge',
    href: '/mobile-recharge',
    color: '#9b87f5',
    bgColor: '#F1F0FB'
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
            <div 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: button.bgColor,
                boxShadow: `0 0 8px 1px ${button.color}20`,
              }}
            >
              <button.icon 
                size={22} 
                className="relative z-10 transition-colors duration-300" 
                style={{ color: button.color }}
              />
            </div>
          </div>
          <span className="text-xs md:text-sm mt-1 font-medium text-center max-w-[70px] truncate" style={{ color: '#6E59A5' }}>
            {button.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
