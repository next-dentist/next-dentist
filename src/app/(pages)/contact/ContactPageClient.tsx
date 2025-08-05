'use client';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import HeaderHThree from '@/components/Headers/HeaderHThree';
import HeaderHTwo from '@/components/Headers/HeaderHTwo';
import InfoCard from '@/components/InfoCard';
import GradientSection from '@/components/Sections/GradientSection';
import ImageSection from '@/components/Sections/ImageSection';
import { SectionThree } from '@/components/SectionThree';
import { SectionTwo } from '@/components/SectionTwo';
import TopRightBlurButton from '@/components/TopRightBlurButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    // Show success message (in a real application)
  };

  return (
    <>
      <SectionTwo className="py-4">
        <Breadcrumbs />
      </SectionTwo>

      <GradientSection className="flex gap-4 py-4">
        <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={Mail}
            title="Email"
            subtitle="contact@nextdentist.com"
            href="mailto:contact@nextdentist.com"
          />
          <InfoCard
            icon={Phone}
            title="Phone"
            subtitle="+91 93280 36817"
            href="tel:+919328036817"
          />
          <InfoCard
            icon={MapPin}
            title="Our Location"
            subtitle="203, Bricklane 1964, Mangal Pandey Rd, near L&T Circle, Karelibagh, Vadodara, Gujarat 390018"
            href="https://maps.app.goo.gl/dMVy1tSb5c83FoPi6"
          />
        </div>
      </GradientSection>

      <SectionThree className="">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <WhiteRoundedBox className="basis-2/3 p-8">
            <div className="flex flex-col gap-6">
              <HeaderHTwo title="Get in Touch" />
              <p>
                Have a question or need assistance? Our team is here to help.
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide details about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </div>
          </WhiteRoundedBox>
          <WhiteRoundedBox className="basis-1/3 overflow-hidden">
            <div className="flex h-full flex-col gap-4">
              <ImageSection
                bgImage="/images/contact-us-image.webp"
                className="flex h-64 flex-col justify-between"
              >
                <div className="flex min-h-20">&nbsp;</div>
                <TopRightBlurButton
                  description="We're Here to Help"
                  href="#"
                  position="center"
                />
              </ImageSection>

              <div className="bg-primary/10 flex flex-grow flex-col gap-6 rounded-4xl p-6">
                <HeaderHThree title="Contact Information" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary h-5 w-5" />
                    <span className="max-w-[300px]">
                      <span className="font-bold">NextDentist PVT LTD</span>
                      <br /> 203, Bricklane 1964, Mangal Pandey Rd, near L&T
                      Circle, Karelibagh, Vadodara, Gujarat 390018
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary h-5 w-5" />
                    <span>contact@nextdentist.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary h-5 w-5" />
                    <span>+91 93280 36817</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary h-5 w-5" />
                    <span>Mon-Sat: 9AM - 6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </WhiteRoundedBox>
        </div>
      </SectionThree>
    </>
  );
};

export default ContactPage;
