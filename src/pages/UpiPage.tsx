
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { AddUpiForm } from '@/components/upi/AddUpiForm';
import { mockUpiIds } from '@/utils/mock-data';
import { Plus, CreditCard } from 'lucide-react';

const UpiPage = () => {
  const [view, setView] = useState<'list' | 'add'>('list');

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-3xl font-bold dark-text-enhanced flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-flexipay-purple dark:text-flexipay-light-purple" />
            <span>My UPI IDs</span>
          </h1>
          {view === 'list' && (
            <Button onClick={() => setView('add')} className="bg-flexipay-purple hover:bg-flexipay-purple/90 text-white dark:bg-flexipay-purple dark:hover:bg-flexipay-purple/80">
              <Plus className="h-4 w-4 mr-2" />
              Add New UPI ID
            </Button>
          )}
          {view === 'add' && (
            <Button variant="outline" onClick={() => setView('list')} 
              className="border-flexipay-purple/30 dark:border-flexipay-purple/50 hover:bg-flexipay-purple/10 dark:hover:bg-flexipay-purple/20">
              Back to List
            </Button>
          )}
        </div>

        {view === 'list' ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 bg-muted dark:bg-gray-800 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">All UPI IDs</TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Recently Used</TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">By Bank</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <UpiSelector upiIds={mockUpiIds} variant="cards" />
            </TabsContent>
            <TabsContent value="recent">
              <UpiSelector 
                upiIds={mockUpiIds.sort((a, b) => {
                  if (!a.lastUsed) return 1;
                  if (!b.lastUsed) return -1;
                  return a.lastUsed.localeCompare(b.lastUsed);
                })} 
                variant="cards" 
              />
            </TabsContent>
            <TabsContent value="bank">
              <UpiSelector 
                upiIds={mockUpiIds.sort((a, b) => a.bank.localeCompare(b.bank))} 
                variant="cards" 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <AddUpiForm />
        )}
      </div>
    </AppLayout>
  );
};

export default UpiPage;
