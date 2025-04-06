
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QrScanner } from '@/components/scanner/QrScanner';
import { mockUpiIds } from '@/utils/mock-data';

const ScanPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6">Scan QR Code</h1>
        <QrScanner upiIds={mockUpiIds} />
      </div>
    </AppLayout>
  );
};

export default ScanPage;
