'use client';
import DentistSearchCard from '@/components/DentistSearchCard';
import { IconList } from '@/components/IconList';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchForm from '@/components/SearchForm';
import SectionFour from '@/components/SectionFour';
import { SectionOne } from '@/components/SectionOne';
import GradientSection from '@/components/Sections/GradientSection';
import ImageSection from '@/components/Sections/ImageSection';
import WhiteSection from '@/components/Sections/WhiteSection';
import { SectionThree } from '@/components/SectionThree';
import { SectionTwo } from '@/components/SectionTwo';
import TopRightBlurButton from '@/components/TopRightBlurButton';
import TreatmentCard from '@/components/TreatmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config';
import { useRecentDentists } from '@/hooks/useDentists';
import { useInfiniteTreatments } from '@/hooks/useInfiniteTreatments';
import { Dentist } from '@prisma/client';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  CalendarArrowUp,
  CheckCircle,
  Mail,
  MessageCircle,
  MoveUpRight,
  ThumbsUp,
  Timer,
  Users,
  X,
} from 'lucide-react';

import Link from 'next/link';
import React, { Suspense, useState } from 'react';

const HomePageClient: React.FC = () => {
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch recently joined dentists
  const {
    data: recentDentists,
    isLoading: isLoadingDentists,
    isError: isDentistsError,
  } = useRecentDentists();

  // Fetch treatments
  const {
    treatments,
    isLoading: isLoadingTreatments,
    isError: isTreatmentsError,
    error: treatmentsError,
  } = useInfiniteTreatments();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const statsVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle newsletter subscription
  const handleSubscribe = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call - replace with actual newsletter subscription API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubscribed(true);
      setShowSuccess(true);
      setEmail('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setIsSubscribed(false);
      }, 5000);
      
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  // Stats for display
  const stats = [
    {
      value: '2000+',
      label: 'Dentists',
      icon: <Users className="text-primary h-8 w-8" />,
    },
    {
      value: '10,000+',
      label: 'Patients',
      icon: <Users className="text-primary h-8 w-8" />,
    },
    {
      value: '98%',
      label: 'Satisfaction',
      icon: <ThumbsUp className="text-primary h-8 w-8" />,
    },
    {
      value: '30 min',
      label: 'Avg. Response',
      icon: <Timer className="text-primary h-8 w-8" />,
    },
  ];

  return (
    <>
      <SectionOne className="from-primary/20 to-secondary/20 flex min-h-[70vh] items-center bg-gradient-to-tr">
        <div className="flex h-full w-full flex-col gap-8 text-black md:flex-row">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WhiteSection className="flex h-full flex-col gap-6 text-black backdrop-blur-sm">
              <motion.h1
                className="text-4xl leading-tight font-bold md:text-5xl"
                {...fadeInUp}
              >
                Find Your Perfect{' '}
                <span className="text-primary">Dental Care</span> Partner
              </motion.h1>
              <motion.p
                className="text-lg opacity-80 md:pr-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Book services from our network of over 2000+ qualified dentists
                and experience hassle-free appointments at your convenience.
              </motion.p>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <SearchForm />
                </motion.div>
              </Suspense>
            </WhiteSection>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageSection
              bgImage="/images/slider/section1.jpg"
              className="relative flex h-full flex-col items-stretch justify-between overflow-hidden rounded-4xl text-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <TopRightBlurButton
                title="Dentists Joined"
                count="2000+"
                description="Dentists Joined"
                href="/dentists"
                position="end"
                icon
              />
              <TopRightBlurButton
                description="Brightening Smile in Hrs"
                href="#"
                position="center"
              />
            </ImageSection>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GradientSection className="flex h-full flex-col gap-6 text-black">
              <h2 className="rounded-2xl p-4 text-2xl font-bold">
                Why Choose Us?
              </h2>
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp}>
                  <IconList
                    icon={<Calendar color="#85A7A8" />}
                    title="Easy Appointment scheduling"
                    sufixIcon={<MoveUpRight color="#85A7A8" />}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <IconList
                    icon={<CalendarArrowUp color="#85A7A8" />}
                    title="Priority Booking"
                    sufixIcon={<MoveUpRight color="#85A7A8" />}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <IconList
                    icon={<Bell color="#85A7A8" />}
                    title="Booking Notification"
                    sufixIcon={<MoveUpRight color="#85A7A8" />}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <IconList
                    icon={<MessageCircle color="#85A7A8" />}
                    title="Easy Consultation"
                    sufixIcon={<MoveUpRight color="#85A7A8" />}
                  />
                </motion.div>
              </motion.div>
            </GradientSection>
          </motion.div>
        </div>
      </SectionOne>

      {/* Stats Section */}
      <motion.div
        className="bg-white py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {stat.icon}
                <h3 className="text-primary mt-3 text-3xl font-bold">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Dentists */}
      <SectionTwo className="from-primary/10 to-secondary/10 bg-gradient-to-tr py-20">
        <motion.div
          className="flex w-full flex-col items-center justify-center gap-4 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold">Recently Joined Dentists</h2>
          <p className="mb-8 max-w-2xl text-center text-gray-600">
            Our network is constantly growing with qualified professionals ready
            to provide excellent dental care services.
          </p>
        </motion.div>
        <div className="flex flex-col gap-4">
          {isLoadingDentists ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : isDentistsError ? (
            <div className="py-8 text-center text-red-500">
              Error loading dentists. Please try again later.
            </div>
          ) : recentDentists && recentDentists.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {recentDentists.map((dentist: Dentist, index: number) => (
                <motion.div
                  key={dentist.id}
                  variants={fadeInUp}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <DentistSearchCard dentistData={dentist as any} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-8 text-center">
              No dentists found. Check back soon!
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/dentists">
            <Button size="lg" className="px-8">
              View All Dentists
            </Button>
          </Link>
        </div>
      </SectionTwo>

      {/* Services Section */}
      <motion.div
        className="bg-white py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div className="mb-12 text-center" variants={fadeInUp}>
            <h2 className="mb-4 text-4xl font-bold">Treatments available</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We provide comprehensive dental services to ensure your smile is
              always at its best.
            </p>
          </motion.div>

          {isLoadingTreatments ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : isTreatmentsError ? (
            <div className="py-8 text-center text-red-500">
              Error loading treatments:{' '}
              {treatmentsError?.message || 'Unknown error'}
            </div>
          ) : treatments && treatments.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {treatments.slice(0, 4).map(treatment => (
                <motion.div
                  key={treatment.id}
                  variants={fadeInUp}
                  custom={treatment.id}
                  transition={{ delay: 0.1 }}
                >
                  <TreatmentCard
                    title={treatment.name || ''}
                    description={treatment.description || ''}
                    imageUrl={treatment.image || ''}
                    slug={treatment.slug || ''}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No treatments found. Check back soon!
            </div>
          )}

          <motion.div className="mt-10 flex justify-center" variants={fadeInUp}>
            <Link href="/treatments">
              <Button size="lg" className="px-8">
                Explore All Treatments
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Reviews Section */}
      <SectionFour className="bg-gradient-to-br from-gray-50 to-gray-100 py-24">
        <motion.div
          className="flex w-full flex-col items-center justify-center gap-6 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ThumbsUp className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold text-gray-900">What Our Patients Say</h2>
          <p className="mb-8 max-w-3xl text-center text-xl text-gray-600">
            Discover why thousands of patients trust us with their dental care
            needs. Real stories from real people who transformed their smiles.
          </p>
        </motion.div>
        
        {/* Horizontal Scrolling Reviews */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 px-8"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...siteConfig.reviews, ...siteConfig.reviews].map((review, index) => (
              <motion.div
                key={`${review.id}-${index}`}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-96 group relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border border-gray-200">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="text-yellow-400 text-xl">
                        ★
                      </div>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <blockquote className="text-gray-700 text-base leading-relaxed mb-6 italic">
                    "{review.review}"
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary/20">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.profession}</div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary/30 transition-all duration-300"
            />
          ))}
        </div>
      </SectionFour>

      {/* CTA Section */}
      <SectionThree className="gap-4 bg-radial from-[#bed5d8] to-[#bed5d8] py-20">
        <motion.div
          className="flex w-full flex-col items-center gap-8 md:flex-row"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex basis-1/2 flex-col gap-6"
            variants={fadeInUp}
          >
            <div className="flex flex-col gap-4 md:max-w-3/4">
              <motion.span
                className="text-primary font-medium"
                variants={fadeInUp}
              >
                Comprehensive Dental Services
              </motion.span>
              <motion.h2
                className="text-4xl leading-tight font-bold"
                variants={fadeInUp}
              >
                Your Trusted Partner for All Your Dental Needs
              </motion.h2>
              <motion.p
                className="mb-6 leading-relaxed text-gray-700"
                variants={fadeInUp}
              >
                At NextDentist Dental Clinics, we provide comprehensive dental
                services to ensure your smile is always at its best. All our
                dentists are highly trained and experienced. We use the latest
                technology and equipment to provide the best possible care.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button size="lg" className="px-8">
                  Book an Appointment
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="flex basis-1/2 flex-col gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ImageSection
              bgImage="/images/nd-dent.webp"
              className="relative flex h-[400px] flex-col items-stretch justify-between overflow-hidden rounded-4xl text-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="flex min-h-20">&nbsp;</div>
              <TopRightBlurButton
                description="Brightening Smile in Hrs"
                href="#"
                position="center"
              />
            </ImageSection>
          </motion.div>
        </motion.div>
      </SectionThree>

      {/* Enhanced Newsletter Signup */}
      <motion.div
        className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <Card className="from-white to-gray-50/50 mx-auto max-w-3xl border-0 bg-gradient-to-br shadow-xl backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div 
                className="mb-8 text-center" 
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="mb-3 text-3xl font-bold text-gray-900">
                  Stay Updated with Dental Tips
                </h2>
                <p className="mx-auto max-w-xl text-base text-gray-600">
                  Subscribe to our newsletter for the latest dental care tips, 
                  exclusive offers, and expert advice from our dental professionals.
                </p>
              </motion.div>

              <motion.div
                className="mx-auto max-w-xl"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {/* Success Message */}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-center justify-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Thank you! You've been successfully subscribed to our newsletter.
                    </span>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center justify-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200"
                  >
                    <X className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                {/* Subscription Form */}
                <div className="flex flex-col gap-3 sm:flex-row items-center">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your email address"
                      className="w-full h-10 rounded-lg border-2 border-gray-200 px-4 text-base transition-all duration-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      disabled={isSubscribing || isSubscribed}
                    />
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                  <Button 
                    onClick={handleSubscribe}
                    disabled={isSubscribing || isSubscribed || !email.trim()}
                    className="h-10 rounded-lg px-6 text-base font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubscribing ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Subscribing...</span>
                      </div>
                    ) : isSubscribed ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Subscribed!</span>
                      </div>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </div>

                {/* Benefits List */}
                <motion.div 
                  className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center gap-2 rounded-lg bg-primary/5 p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Weekly dental tips
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center gap-2 rounded-lg bg-primary/5 p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Exclusive offers
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center gap-2 rounded-lg bg-primary/5 p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Expert advice
                    </span>
                  </motion.div>
                </motion.div>

                <motion.p 
                  className="mt-4 text-center text-xs text-gray-500"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  We respect your privacy. Unsubscribe at any time.
                </motion.p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default HomePageClient;
