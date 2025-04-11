
import React, { useState, useEffect } from 'react';
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
import { Search, UserPlus, Users, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { requestContactsAccess } from '@/utils/pwa-utils';

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
  const [contacts, setContacts] = useState(mockContacts);
  const [contactsApiAvailable, setContactsApiAvailable] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if Contacts API is available
    setContactsApiAvailable('contacts' in navigator && 'ContactsManager' in window);
  }, []);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContactSelect = (contact: typeof mockContacts[0]) => {
    // In a real app, this would navigate to a payment page with pre-filled details
    navigate('/pay-upi', { state: { prefillUpiId: contact.upiId } });
  };

  const loadDeviceContacts = async () => {
    if (!contactsApiAvailable) {
      toast({
        title: "Contacts API not available",
        description: "Your browser doesn't support the Contacts API",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingContacts(true);
    
    try {
      const hasPermission = await requestContactsAccess();
      
      if (hasPermission) {
        // In a real app, we would merge device contacts with existing contacts
        // For now, we'll just show a success message
        toast({
          title: "Contacts loaded",
          description: "Your device contacts are now available for payments",
        });
        
        // We'll keep using our mock contacts for demo purposes
        // In a real app, we would merge real contacts here
      } else {
        toast({
          title: "Permission denied",
          description: "You need to grant permission to access your contacts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading contacts",
        description: "There was a problem accessing your contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContacts(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6 max-w-5xl mx-auto">
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search contacts..." 
                  className="pl-9 dark:bg-gray-800 dark:border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center border-flexipay-purple/30"
                onClick={loadDeviceContacts}
                disabled={isLoadingContacts || !contactsApiAvailable}
              >
                {isLoadingContacts ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Sync Contacts
              </Button>
            </div>
            
            {contactsApiAvailable ? null : (
              <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md text-sm mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
                <span>Enable contact access in Settings to sync your phone contacts</span>
              </div>
            )}
            
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
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
