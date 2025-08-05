'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface SEOAnalysisFormProps {
  buttonText?: string;
  buttonClassName?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  submitButtonText?: string;
}

export default function SEOAnalysisForm({
  buttonText = "Start Your Free SEO Analysis",
  buttonClassName = "group h-10 md:h-12 lg:h-14 px-4 md:px-6 lg:px-8 text-sm md:text-base lg:text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full md:w-auto cursor-pointer",
  dialogTitle = "Free Dental SEO Analysis Request",
  dialogDescription = "Get your personalized dental SEO services analysis and discover how to dominate local search with the best dental SEO agency.",
  submitButtonText = "Get My Free Analysis"
}: SEOAnalysisFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    website: '',
    email: '',
    clinicName: '',
    city: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here to submit the form data
    // Example: await submitForm(formData);
    
    // Close dialog after submission
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      website: '',
      email: '',
      clinicName: '',
      city: ''
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className={`${buttonClassName} relative z-50`}
          onClick={() => {
            console.log('SEO Analysis button clicked!');
            setIsDialogOpen(true);
          }}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl md:text-2xl font-bold">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-base md:text-lg">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Mobile: Vertical layout, Desktop: Horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                Website Address
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                required
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clinicName" className="block text-sm font-medium text-foreground mb-2">
                Clinic Name
              </label>
              <Input
                id="clinicName"
                name="clinicName"
                type="text"
                required
                value={formData.clinicName}
                onChange={handleInputChange}
                placeholder="Enter your clinic name"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <Input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                className="h-10 md:h-12 text-sm md:text-base"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-10 md:h-12 text-sm md:text-base font-semibold">
            {submitButtonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 