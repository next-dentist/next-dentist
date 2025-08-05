'use client';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import HeaderHOne from '@/components/Headers/HeaderHOne';
import HeaderHThree from '@/components/Headers/HeaderHThree';
import HeaderHTwo from '@/components/Headers/HeaderHTwo';
import ImageSection from '@/components/Sections/ImageSection';
import { SectionThree } from '@/components/SectionThree';
import { SectionTwo } from '@/components/SectionTwo';
import TopRightBlurButton from '@/components/TopRightBlurButton';
import { Button } from '@/components/ui/button';
import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { CheckCircle } from 'lucide-react';
import React from 'react';

const AboutPage: React.FC = () => {
  const missionPoints = [
    'Connect patients with qualified dentists',
    'Streamline the appointment booking process',
    'Provide transparent information about dental services',
    'Make quality dental care accessible to everyone',
    'Support dentists in growing their practice',
  ];

  return (
    <>
      <SectionTwo className="py-4">
        <Breadcrumbs />
      </SectionTwo>
      <SectionTwo className="py-4">
        <HeaderHOne title="About NextDentist" />
      </SectionTwo>
      <SectionThree className="">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <WhiteRoundedBox className="basis-2/3 p-8">
            <div className="flex flex-col gap-6">
              <HeaderHTwo title="Our Mission" />
              <p>
                At NextDentist, we're revolutionizing how patients connect with
                dental professionals. Our platform is designed to make finding
                and booking dental appointments as seamless as possible while
                providing dentists with a powerful tool to grow their practices.
                We specialize in connecting patients with experts in dental
                implants, cosmetic dentistry, orthodontics, and root canal
                procedures.
              </p>
              <p>
                Founded in 2023, our team of healthcare experts and technology
                specialists came together with a common goal: to transform the
                dental care experience through innovation, accessibility, and
                transparency. Whether you need dental implants or cosmetic
                dentistry treatments, NextDentist helps you find the right
                specialist.
              </p>
              <ul className="mt-4 space-y-3">
                {missionPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-primary h-5 w-5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button>Join Our Network</Button>
              </div>
            </div>
          </WhiteRoundedBox>
          <WhiteRoundedBox className="basis-1/3 overflow-hidden p-0">
            <ImageSection
              bgImage="/images/dentist-card.jpg"
              className="flex h-full flex-col justify-between"
            >
              <div className="flex min-h-20">&nbsp;</div>
              <TopRightBlurButton
                description="Building Better Smiles Together"
                href="#"
                position="center"
              />
            </ImageSection>
          </WhiteRoundedBox>
        </div>
      </SectionThree>

      <SectionThree className="gap-4 bg-radial from-[#bed5d8] to-[#bed5d8] py-20">
        <div className="flex w-full flex-col gap-8 md:flex-row">
          <div className="flex basis-1/2 flex-col gap-4">
            <HeaderHTwo title="Our Story" />
            <p>
              NextDentist began with a simple observation: finding the right
              dentist was often more complicated than it needed to be. Our
              founders experienced firsthand the challenges of searching for
              specialized dental care in unfamiliar locations, comparing
              qualifications, and navigating appointment booking systems.
              Whether looking for dental implants, orthodontics treatments, or
              cosmetic dentistry services, patients deserved better.
            </p>
            <p>
              This inspired us to create a platform that centralizes dental care
              information and services, making it easier for patients to find
              exactly what they need and for dentists to connect with the
              patients who need them most. From routine cleanings to complex
              root canal procedures, our platform covers all dental specialties.
            </p>
            <p>
              Today, NextDentist partners with thousands of dental professionals
              across the country, facilitating countless appointments daily and
              helping both patients and dentists achieve better outcomes through
              improved access and communication.
            </p>
          </div>
          <div className="flex basis-1/2 flex-col gap-6">
            <HeaderHTwo title="Why Choose NextDentist?" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <WhiteRoundedBox className="p-6">
                <HeaderHThree title="Verified Professionals" />
                <p>
                  All dentists on our platform are thoroughly vetted and their
                  credentials verified.
                </p>
              </WhiteRoundedBox>
              <WhiteRoundedBox className="p-6">
                <HeaderHThree title="Easy Booking" />
                <p>
                  Book appointments instantly with our streamlined,
                  user-friendly interface.
                </p>
              </WhiteRoundedBox>
              <WhiteRoundedBox className="p-6">
                <HeaderHThree title="Comprehensive Information" />
                <p>
                  Detailed profiles help you make informed decisions about your
                  dental care.
                </p>
              </WhiteRoundedBox>
              <WhiteRoundedBox className="p-6">
                <HeaderHThree title="Support Network" />
                <p>
                  Our team is always available to assist with any questions or
                  concerns.
                </p>
              </WhiteRoundedBox>
            </div>
          </div>
        </div>
      </SectionThree>

      <SectionThree className="py-16">
        <WhiteRoundedBox className="w-full p-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <HeaderHTwo title="Our Vision for the Future" />
            <p>
              We envision a world where quality dental care is accessible to
              everyone, where booking a dental appointment is as simple as
              ordering takeout, and where dentists can focus on what they do
              best: providing exceptional care to their patients.
            </p>
            <p>
              As we grow, we're constantly innovating and expanding our services
              to better serve both patients and dental professionals. We're
              committed to improving oral health outcomes through technology,
              education, and accessibility.
            </p>
            <div className="mt-6">
              <Button>Contact Us</Button>
            </div>
          </div>
        </WhiteRoundedBox>
      </SectionThree>
    </>
  );
};

export default AboutPage;
