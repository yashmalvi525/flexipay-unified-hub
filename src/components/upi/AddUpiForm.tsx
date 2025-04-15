
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';

export const AddUpiForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    nickname: '',
    bank: '',
    isDefault: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isDefault: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Success",
        description: "New UPI ID has been added successfully.",
      });
      
      // Reset form after showing success for a moment
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          upiId: '',
          nickname: '',
          bank: '',
          isDefault: false
        });
      }, 2000);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New UPI ID</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input 
              id="upiId" 
              placeholder="username@bank" 
              required 
              value={formData.upiId}
              onChange={handleChange}
              disabled={isSubmitting || isSuccess}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Display Name</Label>
            <Input 
              id="nickname" 
              placeholder="Personal SBI" 
              required 
              value={formData.nickname}
              onChange={handleChange}
              disabled={isSubmitting || isSuccess}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank">Bank Name</Label>
            <Input 
              id="bank" 
              placeholder="State Bank of India" 
              required 
              value={formData.bank}
              onChange={handleChange}
              disabled={isSubmitting || isSuccess}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="default" 
              checked={formData.isDefault}
              onCheckedChange={handleSwitchChange}
              disabled={isSubmitting || isSuccess}
            />
            <Label htmlFor="default">Set as default</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="btn-primary w-full relative" 
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <span>Adding UPI ID...</span>
            ) : isSuccess ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                UPI ID Added
              </span>
            ) : (
              <span>Add UPI ID</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
