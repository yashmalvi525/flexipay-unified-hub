
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, UserPlus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock contact data
const mockContacts = [
  { id: '1', name: 'Aditya Sharma', phone: '9876543210', upiId: 'aditya@okicici' },
  { id: '2', name: 'Priya Singh', phone: '8765432109', upiId: 'priya@okhdfc' },
  { id: '3', name: 'Rahul Kumar', phone: '7654321098', upiId: 'rahul@okaxi' },
  { id: '4', name: 'Neha Patel', phone: '6543210987', upiId: 'neha@okici' },
  { id: '5', name: 'Vikram Joshi', phone: '9876543211', upiId: 'vikram@okpnb' },
  { id: '6', name: 'Anjali Mishra', phone: '7777654321', upiId: 'anjali@oksbi' },
  { id: '7', name: 'Kunal Shah', phone: '8888765432', upiId: 'kunal@okhdfc' },
  { id: '8', name: 'Deepika Malhotra', phone: '9999876543', upiId: 'deepika@oksbi' },
];

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter(
    contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContactSelect = (contact: typeof mockContacts[0]) => {
    // In a real app, this would navigate to a payment page with pre-filled details
    navigate('/pay-upi', { state: { prefillUpiId: contact.upiId } });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Pay Contacts</h1>
          <p className="text-muted-foreground">Send money to your contacts</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-flexipay-purple" />
              Your Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search contacts..." 
                  className="pl-9 dark:bg-gray-800 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center border-flexipay-purple/30">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
            
            <div className="rounded-md border dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="dark:bg-gray-800 dark:hover:bg-gray-700">
                    <TableHead className="w-[250px] dark:text-gray-300">Name</TableHead>
                    <TableHead className="dark:text-gray-300">Phone</TableHead>
                    <TableHead className="dark:text-gray-300">UPI ID</TableHead>
                    <TableHead className="text-right dark:text-gray-300">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="dark:border-gray-700 dark:hover:bg-gray-800">
                        <TableCell className="font-medium dark:text-white">{contact.name}</TableCell>
                        <TableCell className="dark:text-gray-300">{contact.phone}</TableCell>
                        <TableCell className="dark:text-gray-300">{contact.upiId}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={() => handleContactSelect(contact)}
                            className="bg-flexipay-purple hover:bg-flexipay-purple/90 text-white"
                          >
                            Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 dark:text-gray-400">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
