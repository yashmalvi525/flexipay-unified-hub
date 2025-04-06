
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const AddUpiForm: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate and add the UPI ID
    toast({
      title: "Success",
      description: "New UPI ID has been added successfully.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New UPI ID</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input id="upi-id" placeholder="username@bank" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Display Name</Label>
            <Input id="nickname" placeholder="Personal SBI" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank">Bank Name</Label>
            <Input id="bank" placeholder="State Bank of India" required />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="default" />
            <Label htmlFor="default">Set as default</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="btn-primary w-full">Add UPI ID</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
