
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { AddUpiForm } from '@/components/upi/AddUpiForm';
import { mockUpiIds } from '@/utils/mock-data';
import { Plus } from 'lucide-react';

const UpiPage = () => {
  const [view, setView] = useState<'list' | 'add'>('list');

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My UPI IDs</h1>
          {view === 'list' && (
            <Button onClick={() => setView('add')} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New UPI ID
            </Button>
          )}
          {view === 'add' && (
            <Button variant="outline" onClick={() => setView('list')}>
              Back to List
            </Button>
          )}
        </div>

        {view === 'list' ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All UPI IDs</TabsTrigger>
              <TabsTrigger value="recent">Recently Used</TabsTrigger>
              <TabsTrigger value="bank">By Bank</TabsTrigger>
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
