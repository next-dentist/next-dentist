'use client';

import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Search,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

export default function DentalSEOAds1Page() {
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [currentFeaturesSlide, setCurrentFeaturesSlide] = useState(0);
  
  const mobileTestimonials = [
    {
      name: "Dr. James Mitchell",
      practice: "Smile Dental Center",
      testimonial: "Our patient bookings increased by 400% within 3 months. The team's understanding of dental SEO is unmatched.",
      rating: 5,
      initials: "JM",
      color: "bg-primary"
    },
    {
      name: "Dr. Sarah Parker",
      practice: "Advanced Orthodontics",
      testimonial: "Finally, an SEO agency that truly understands dental marketing. Our ROI has been incredible.",
      rating: 5,
      initials: "SP",
      color: "bg-secondary"
    },
    {
      name: "Dr. Michael Roberts",
      practice: "Premier Dental Group",
      testimonial: "We went from page 3 to #1 rankings for all our main keywords. The results speak for themselves.",
      rating: 5,
      initials: "MR",
      color: "bg-primary"
    }
  ];

  const mobileFeatures = [
    { 
      icon: Search, 
      title: "Show Up First", 
      description: "Rank #1 when patients search 'dentist near me'", 
      benefit: "Top Visibility"
    },
    { 
      icon: MapPin, 
      title: "Appear on Maps", 
      description: "Get found on Google Maps and local searches", 
      benefit: "Map Presence"
    },
    { 
      icon: Users, 
      title: "Build Trust", 
      description: "Positive reviews and local citations build credibility", 
      benefit: "Patient Trust"
    },
    { 
      icon: TrendingUp, 
      title: "More Phone Calls", 
      description: "Get more calls from patients searching locally", 
      benefit: "Lead Generation"
    },
    { 
      icon: Target, 
      title: "Beat Competitors", 
      description: "Outrank other dental practices in your area", 
      benefit: "Competitive Edge"
    },
    { 
      icon: Clock, 
      title: "Quick Results", 
      description: "See improvements in 30-90 days", 
      benefit: "Fast Results"
    }
  ];

  const nextMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % mobileTestimonials.length);
  };

  const prevMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev - 1 + mobileTestimonials.length) % mobileTestimonials.length);
  };

  const nextFeaturesSlide = () => {
    setCurrentFeaturesSlide((prev) => (prev + 1) % mobileFeatures.length);
  };

  const prevFeaturesSlide = () => {
    setCurrentFeaturesSlide((prev) => (prev - 1 + mobileFeatures.length) % mobileFeatures.length);
  };



  return (
    <div className="min-h-screen bg-background">
            {/* Hero Section - Two Column Layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/10 to-secondary/10 py-8 md:py-4 lg:py-6 min-h-screen flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile Layout - Image below heading */}
          <div className="lg:hidden space-y-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 md:gap-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium text-primary shadow-sm border border-primary/20">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs md:text-sm lg:text-base">#1 Dental SEO Company - Best Dental SEO Agency</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-foreground">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                #1 Dental SEO Services
              </span>
              <br />
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                Dominate Local Search Results
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
              Stop losing patients to competitors. Our proven dental SEO services and local SEO for dentists strategy gets you 
              <span className="text-primary font-semibold"> 300% more patient calls</span> in just 90 days. Grow dental practice online with the best dental SEO agency.
            </p>

            {/* Image - Now below heading in mobile */}
            <div className="flex justify-center">
              <div className="relative animate-fade-in-up max-w-xs sm:max-w-sm md:max-w-md">
                <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg md:shadow-xl lg:shadow-2xl border border-border/20 bg-gradient-to-br from-background to-card group">
                  <img
                    src="/images/nd-seo-ads2.webp"
                    alt="Dental SEO Growth Dashboard"
                    className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced floating stats boxes */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-background/95 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">608%</div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium">Traffic Increase</div>
                      <div className="mt-1 md:mt-2 h-0.5 md:h-1 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 lg:bottom-4 lg:left-4 bg-background/95 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">#1</div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium">Average Ranking</div>
                      <div className="mt-1 md:mt-2 h-0.5 md:h-1 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                    </div>
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg sm:rounded-tl-xl md:rounded-tl-2xl lg:rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-r-2 border-b-2 border-secondary/30 rounded-br-lg sm:rounded-br-xl md:rounded-br-2xl lg:rounded-br-3xl"></div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 max-w-md mx-auto">
              {[
                { number: "500+", label: "Dental Practices", icon: Users },
                { number: "93%", label: "Success Rate", icon: TrendingUp },
                { number: "300%", label: "Traffic Increase", icon: BarChart3 },
                { number: "90 Days", label: "To See Results", icon: Clock }
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-2 md:gap-3 lg:gap-4 bg-background/50 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 border border-border/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                  <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div className="text-center min-w-0 flex-1">
                    <div className="text-sm md:text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium truncate">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center relative z-10">
              <SEOAnalysisForm />
            </div>
          </div>

          {/* Desktop Layout - Original two-column structure */}
          <div className="hidden lg:grid grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - All Content */}
            <div className="space-y-6 md:space-y-8 lg:space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 md:gap-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium text-primary shadow-sm border border-primary/20">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs md:text-sm lg:text-base">#1 Dental SEO Company - Best Dental SEO Agency</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-foreground">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  #1 Dental SEO Services
                </span>
                <br />
                <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  Dominate Local Search Results
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
                Stop losing patients to competitors. Our proven dental SEO services and local SEO for dentists strategy gets you 
                <span className="text-primary font-semibold"> 300% more patient calls</span> in just 90 days. Grow dental practice online with the best dental SEO agency.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                {[
                  { number: "500+", label: "Dental Practices", icon: Users },
                  { number: "93%", label: "Success Rate", icon: TrendingUp },
                  { number: "300%", label: "Traffic Increase", icon: BarChart3 },
                  { number: "90 Days", label: "To See Results", icon: Clock }
                ].map((stat, index) => (
                  <div key={stat.label} className="flex items-center gap-2 md:gap-3 lg:gap-4 bg-background/50 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 border border-border/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                    <div className="text-center min-w-0 flex-1">
                      <div className="text-sm md:text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                        {stat.number}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium truncate">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className='relative z-10'>
                <SEOAnalysisForm />
              </div>
            </div>

            {/* Right Column - Portrait Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative animate-fade-in-up max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg md:shadow-xl lg:shadow-2xl border border-border/20 bg-gradient-to-br from-background to-card group">
                  <img
                    src="/images/nd-seo-ads2.webp"
                    alt="Dental SEO Growth Dashboard"
                    className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced floating stats boxes */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-background/95 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">608%</div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium">Traffic Increase</div>
                      <div className="mt-1 md:mt-2 h-0.5 md:h-1 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 lg:bottom-4 lg:left-4 bg-background/95 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-2 md:p-3 lg:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">#1</div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium">Average Ranking</div>
                      <div className="mt-1 md:mt-2 h-0.5 md:h-1 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                    </div>
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg sm:rounded-tl-xl md:rounded-tl-2xl lg:rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-r-2 border-b-2 border-secondary/30 rounded-br-lg sm:rounded-br-xl md:rounded-br-2xl lg:rounded-br-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Local SEO Matters - Enhanced with Mobile Scrolling */}
      <section className="bg-primary py-12 md:py-16 lg:py-20 xl:py-24" >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold text-white border border-white/30 animate-fade-in-up shadow-lg">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse"></div>
              Dental SEO Services - SEO for Dentists
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Why <span className="text-white">Local SEO for Dentists</span> Matters for Dental Practices
            </h2>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              When patients search for "dentist near me," you want to be the first practice they see. Our dental SEO services and local SEO for dentists make that happen. Grow dental practice online with the best dental SEO agency.
            </p>
          </div>
          
          {/* Desktop: Auto-scrolling features */}
          <div className="hidden lg:block relative overflow-hidden">
            <div className="flex gap-1 md:gap-1 animate-continuous-move" style={{ width: '100%' }}>
              {[
                { 
                  icon: Search, 
                  title: "Show Up First", 
                  description: "Rank #1 when patients search 'dentist near me'", 
                  benefit: "Top Visibility"
                },
                { 
                  icon: MapPin, 
                  title: "Appear on Maps", 
                  description: "Get found on Google Maps and local searches", 
                  benefit: "Map Presence"
                },
                { 
                  icon: Users, 
                  title: "Build Trust", 
                  description: "Positive reviews and local citations build credibility", 
                  benefit: "Patient Trust"
                },
                { 
                  icon: TrendingUp, 
                  title: "More Phone Calls", 
                  description: "Get more calls from patients searching locally", 
                  benefit: "Lead Generation"
                },
                { 
                  icon: Target, 
                  title: "Beat Competitors", 
                  description: "Outrank other dental practices in your area", 
                  benefit: "Competitive Edge"
                },
                { 
                  icon: Clock, 
                  title: "Quick Results", 
                  description: "See improvements in 30-90 days", 
                  benefit: "Fast Results"
                }
              ].map((feature, index) => (
                <div key={feature.title} className="group bg-card/95 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-border/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up w-60 md:w-72 h-60 md:h-72 flex flex-col items-center justify-center text-center flex-shrink-0" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow mb-4">
                    <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-tight mb-3">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-sm font-medium text-primary border border-primary/20">
                    {feature.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Slider with navigation arrows */}
          <div className="lg:hidden relative">
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentFeaturesSlide * 100}%)` }}
              >
                {mobileFeatures.map((feature, index) => (
                  <div 
                    key={feature.title} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="group bg-card/95 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-border/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow mb-3 md:mb-4">
                        <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-tight mb-3">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-xs font-medium text-primary border border-primary/20">
                        {feature.benefit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevFeaturesSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Previous feature"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
            </button>
            
            <button
              onClick={nextFeaturesSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Next feature"
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {mobileFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeaturesSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentFeaturesSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* See Your Practice Dominate Local Search - Full Screen */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-card/50 to-background py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block animate-fade-in-up">
                <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                  See Your Practice <span className="text-primary relative">
                    Dominate Local Search
                    <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full"></div>
                  </span>
                </h2>
              </div>
              <p className="mx-auto max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in-up delay-200">
                This is exactly how your dental practice will appear when patients search for "dentist near me" - at the top of Google's local results. Our dental SEO services and SEO for dental clinics ensure you dominate local search.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-14 items-center">
              {/* Left Column - Image */}
              <div className="relative animate-fade-in-up order-2 lg:order-1">
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border border-border/20 bg-gradient-to-br from-background to-card group max-w-2x1 mx-auto lg:mx-0">
                  <img 
                    src="/images/nd-seo-banner.webp" 
                    alt="Google Search Results for 'Dentist Near Me' - Local SEO Success Example" 
                    className="w-full h-auto object-cover max-h-96 md:max-h-[500px] lg:h-[380px] lg:w-[670px] transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Enhanced overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Corner accent elements */}
                  <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg sm:rounded-tl-xl md:rounded-tl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-r-2 border-b-2 border-secondary/30 rounded-br-lg sm:rounded-br-xl md:rounded-br-2xl"></div>
                  
                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="space-y-8 md:space-y-10 animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
                    <Search className="h-8 w-8 md:h-9 md:w-9 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">Top 3 Rankings</h3>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">Appear in Google's top 3 local results for maximum visibility and click-through rates.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-secondary/10 flex items-center justify-center shadow-lg">
                    <Star className="h-8 w-8 md:h-9 md:w-9 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">5-Star Reviews</h3>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">Build trust with positive Google reviews that influence patient decisions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <div className="flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
                    <MapPin className="h-8 w-8 md:h-9 md:w-9 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">Local Map Presence</h3>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">Show up on Google Maps with your exact location and contact information.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Proven SEO Framework - Compact Enhanced */}
      <section className="bg-primary py-12 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <div className="inline-block animate-fade-in-up">
              <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                Our Proven Dental SEO Framework
                <div className="mt-2 h-1 w-16 md:w-24 bg-white/30 rounded-full mx-auto animate-pulse"></div>
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base md:text-lg lg:text-xl text-white/90 animate-fade-in-up delay-200">
              A systematic 5-step approach that has helped achieve top rankings. Our dental SEO company delivers proven results for dental practices nationwide.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { 
                step: "01", 
                title: "Comprehensive Audit", 
                description: "Deep analysis of your current SEO performance and local presence",
                icon: Search,
                color: "from-white/20 to-white/10"
              },
              { 
                step: "02", 
                title: "Strategic Planning", 
                description: "Custom strategy tailored to your practice and local market",
                icon: Target,
                color: "from-white/20 to-white/10"
              },
              { 
                step: "03", 
                title: "Local Optimization", 
                description: "Google My Business optimization and local citation building",
                icon: MapPin,
                color: "from-white/20 to-white/10"
              },
              { 
                step: "04", 
                title: "Content Creation", 
                description: "Patient-focused content that ranks for local search terms",
                icon: FileText,
                color: "from-white/20 to-white/10"
              },
              { 
                step: "05", 
                title: "Ongoing Monitoring", 
                description: "Continuous tracking and optimization for sustained results",
                icon: BarChart3,
                color: "from-white/20 to-white/10"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group transform rounded-xl md:rounded-2xl bg-white/95 backdrop-blur-sm p-4 md:p-6 border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-white/50 to-transparent"></div>
                
                {/* Step Badge */}
                <div className="relative mb-3 md:mb-4 flex justify-end">
                  <div className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white text-xs md:text-sm font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                
                {/* Icon Container with Enhanced Styling */}
                <div className="relative mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg">
                  <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
                </div>
                
                {/* Content with Enhanced Typography */}
                <div className="relative z-10">
                  <h3 className="mb-2 md:mb-3 text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Progress indicator */}
          <div className="mt-8 md:mt-12 text-center animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              <span className="text-base font-semibold text-white">5-Step Process</span>
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '500ms' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored for Dental Professionals - Enhanced & Unique */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Dental SEO Services - SEO for Dental Clinics
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Built for <span className="text-primary relative">
                Dental Practices
                <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full"></div>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              Dental-specific local SEO strategies that target the exact keywords your patients are searching for, with proven results in 30 days. Our dentist SEO expert team delivers dental digital marketing solutions that grow dental practice online.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            {[
              {
                title: "Local Search Domination",
                description: "Rank #1 for 'dentist near me' and location-based searches in 30 days",
                icon: Search,
                color: "text-primary",
                bgColor: "bg-primary/10",
                iconBg: "bg-primary/20",
                stat: "↑ 300% more local traffic"
              },
              {
                title: "Treatment-Specific SEO",
                description: "Target patients searching for specific dental procedures and services",
                icon: TrendingUp,
                color: "text-secondary",
                bgColor: "bg-secondary/10",
                iconBg: "bg-secondary/20",
                stat: "5X more new patients"
              },
              {
                title: "Google My Business Optimization",
                description: "Maximize your local presence with expert GMB management and review acquisition",
                icon: Star,
                color: "text-primary",
                bgColor: "bg-primary/10",
                iconBg: "bg-primary/20",
                stat: "85% booking rate"
              },
              {
                title: "Emergency Dental SEO",
                description: "Capture urgent dental care searches when patients need immediate treatment",
                icon: Clock,
                color: "text-secondary",
                bgColor: "bg-secondary/10",
                iconBg: "bg-secondary/20",
                stat: "24/7 patient capture"
              },
              {
                title: "Insurance & Payment SEO",
                description: "Rank for insurance-related dental search terms and payment options",
                icon: Shield,
                color: "text-primary",
                bgColor: "bg-primary/10",
                iconBg: "bg-primary/20",
                stat: "↑ 200% insurance queries"
              },
              {
                title: "Appointment Booking Optimization",
                description: "Optimize for patients ready to book appointments and consultations",
                icon: Calendar,
                color: "text-secondary",
                bgColor: "bg-secondary/10",
                iconBg: "bg-secondary/20",
                stat: "90% conversion rate"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group transform rounded-xl md:rounded-2xl bg-background p-6 md:p-8 border border-border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-background/50 to-transparent"></div>
                
                {/* Icon Container with Enhanced Styling */}
                <div className={`relative mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-lg md:rounded-xl ${item.iconBg} ${item.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg`}>
                  <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <item.icon className="h-6 w-6 md:h-8 md:w-8 relative z-10" />
                </div>
                
                {/* Content with Enhanced Typography */}
                <div className="relative z-10">
                  <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300 mb-4">
                    {item.description}
                  </p>
                  <div className={`text-sm md:text-base font-bold bg-gradient-to-r ${item.color === 'text-primary' ? 'from-primary to-primary/80' : 'from-secondary to-secondary/80'} bg-clip-text text-transparent animate-stat-pulse group-hover:scale-110 transition-transform duration-300`}>
                    {item.stat}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Progress indicator */}
          <div className="mt-12 md:mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-lg">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-base font-semibold text-primary">Proven Results in 30 Days</span>
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '500ms' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Dental Practice Results - Interactive & Visual - Full Screen */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden py-4 md:py-8 lg:py-12 xl:py-16 2xl:py-24">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-4 md:mb-6 lg:mb-8 xl:mb-12 2xl:mb-16 text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 rounded-full bg-primary/10 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base lg:text-lg font-medium text-primary border border-primary/20 animate-fade-in-up">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary animate-pulse"></div>
              Success Stories
            </div>
            <h2 className="mb-2 md:mb-3 lg:mb-4 xl:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-foreground animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Real Dental Practice <span className="text-primary">Transformations</span>
            </h2>
            <p className="mx-auto max-w-3xl text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              See how our dental SEO services transformed these practices from struggling to dominate local search results.
            </p>
          </div>

          <div className="mx-auto max-w-7xl">
            {/* Desktop: Original layout */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Timeline-style comparison */}
                <div className="relative mb-12">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-muted-foreground/30 via-primary/50 to-primary transform -translate-x-1/2"></div>
                  
                  {/* Before Results - Left side */}
                  <div className="relative mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                      <div className="w-5/12">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center gap-3 rounded-full bg-muted/20 px-6 py-3 border border-border">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse"></div>
                            <span className="text-base md:text-lg font-bold text-muted-foreground">Before SEO</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-2xl p-6 md:p-8 border border-border/50">
                          <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/30">
                              <span className="text-sm md:text-base font-medium text-muted-foreground">"Dentist near me"</span>
                              <span className="text-base md:text-lg font-bold text-muted-foreground">Page 3</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/30">
                              <span className="text-sm md:text-base font-medium text-muted-foreground">"Dental implants"</span>
                              <span className="text-base md:text-lg font-bold text-muted-foreground">Page 5</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/30">
                              <span className="text-sm md:text-base font-medium text-muted-foreground">Monthly Traffic</span>
                              <span className="text-base md:text-lg font-bold text-muted-foreground">1,200 visits</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Center arrow */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-xl">
                          <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* After Results - Right side */}
                      <div className="w-5/12">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 shadow-xl">
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                            <span className="text-base md:text-lg font-bold text-white">After SEO</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-6 md:p-8 border border-primary/30">
                          <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/90 border border-primary/20">
                              <span className="text-sm md:text-base font-medium text-foreground">"Dentist near me"</span>
                              <span className="text-base md:text-lg font-bold text-primary">#1 Position</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/90 border border-primary/20">
                              <span className="text-sm md:text-base font-medium text-foreground">"Dental implants"</span>
                              <span className="text-base md:text-lg font-bold text-primary">#2 Position</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/90 border border-primary/20">
                              <span className="text-sm md:text-base font-medium text-foreground">Monthly Traffic</span>
                              <span className="text-base md:text-lg font-bold text-primary">8,500 visits</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Side-by-side layout */}
            <div className="lg:hidden">
              <div className="grid grid-cols-2 gap-4">
                {/* Before SEO */}
                <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted/20 px-3 py-1 border border-border">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse"></div>
                      <span className="text-xs font-bold text-muted-foreground">Before</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-3 border border-border/50">
                    <div className="space-y-2">
                      <div className="text-center p-2 rounded-md bg-background/80 border border-border/30">
                        <div className="text-xs font-medium text-muted-foreground mb-1">"Dentist near me"</div>
                        <div className="text-sm font-bold text-muted-foreground">Page 3</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-background/80 border border-border/30">
                        <div className="text-xs font-medium text-muted-foreground mb-1">"Dental implants"</div>
                        <div className="text-sm font-bold text-muted-foreground">Page 5</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-background/80 border border-border/30">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Monthly Traffic</div>
                        <div className="text-sm font-bold text-muted-foreground">1,200 visits</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After SEO */}
                <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 shadow-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      <span className="text-xs font-bold text-white">After</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-3 border border-primary/30">
                    <div className="space-y-2">
                      <div className="text-center p-2 rounded-md bg-background/90 border border-primary/20">
                        <div className="text-xs font-medium text-foreground mb-1">"Dentist near me"</div>
                        <div className="text-sm font-bold text-primary">#1 Position</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-background/90 border border-primary/20">
                        <div className="text-xs font-medium text-foreground mb-1">"Dental implants"</div>
                        <div className="text-sm font-bold text-primary">#2 Position</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-background/90 border border-primary/20">
                        <div className="text-xs font-medium text-foreground mb-1">Monthly Traffic</div>
                        <div className="text-sm font-bold text-primary">8,500 visits</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile-only image below comparison table */}
            <div className="lg:hidden mt-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="flex justify-center">
                <div className="relative max-w-sm">
                  <div className="relative rounded-lg overflow-hidden shadow-lg border border-border/20 bg-gradient-to-br from-background to-card group">
                    <img
                      src="/images/nd-seo-graph.webp"
                      alt="Dental SEO Growth Graph - Success Metrics"
                      className="w-70 h-70 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-secondary/30 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with Auto-scrolling */}
      <section className="bg-card py-8 md:py-12 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-8 md:mb-12 lg:mb-16 text-center">
            <div className="inline-block animate-fade-in-up">
              <h2 className="mb-3 md:mb-4 lg:mb-6 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-foreground">
                Dental Practice Success Stories
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground animate-fade-in-up delay-200">
              See how our dental SEO services and dentist marketing agency helped practices dominate local search and increase patient bookings. The best dental SEO agency delivers results.
            </p>
          </div>

          {/* Desktop: Auto-scrolling testimonials */}
          <div className="hidden lg:block mx-auto max-w-7xl overflow-hidden">
            <div className="grid gap-8 md:grid-cols-3 animate-continuous-move pb-8">
              {[
                {
                  name: "Dr. James Mitchell",
                  practice: "Smile Dental Center",
                  testimonial: "We now rank #1 for 'dentist near me' and 'dental implants'. Patient bookings increased by 400% in just 3 months.",
                  rating: 5,
                  initials: "JM",
                  color: "bg-primary"
                },
                {
                  name: "Dr. Sarah Parker",
                  practice: "Advanced Orthodontics",
                  testimonial: "Our Google My Business optimization brought us 300% more local patients. The local SEO strategy is brilliant.",
                  rating: 5,
                  initials: "SP",
                  color: "bg-secondary"
                },
                {
                  name: "Dr. Michael Roberts",
                  practice: "Premier Dental Group",
                  testimonial: "From page 3 to #1 for all our local keywords. Our practice revenue increased by $75K in the first quarter.",
                  rating: 5,
                  initials: "MR",
                  color: "bg-primary"
                },
                // Duplicate for seamless loop
                {
                  name: "Dr. James Mitchell",
                  practice: "Smile Dental Center",
                  testimonial: "We now rank #1 for 'dentist near me' and 'dental implants'. Patient bookings increased by 400% in just 3 months.",
                  rating: 5,
                  initials: "JM",
                  color: "bg-primary"
                },
                {
                  name: "Dr. Sarah Parker",
                  practice: "Advanced Orthodontics",
                  testimonial: "Our Google My Business optimization brought us 300% more local patients. The local SEO strategy is brilliant.",
                  rating: 5,
                  initials: "SP",
                  color: "bg-secondary"
                },
                {
                  name: "Dr. Michael Roberts",
                  practice: "Premier Dental Group",
                  testimonial: "From page 3 to #1 for all our local keywords. Our practice revenue increased by $75K in the first quarter.",
                  rating: 5,
                  initials: "MR",
                  color: "bg-primary"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-3xl bg-background p-8 shadow-lg border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-primary/5 to-transparent"></div>
                  
                  {/* Star Rating */}
                  <div className="relative mb-6 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i}
                          className="h-5 w-5 fill-current transition-transform duration-300 hover:scale-110" 
                        />
                      ))}
                    </div>
                    <div className="ml-4 text-sm font-medium text-muted-foreground">
                      {testimonial.rating}.0 Rating
                    </div>
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="relative mb-6">
                    <div className="absolute -top-2 -left-2 text-4xl text-primary/20">"</div>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="relative mb-8 leading-relaxed text-foreground text-lg italic">
                    "{testimonial.testimonial}"
                  </p>
                  
                  {/* Author Information */}
                  <div className="relative flex items-center">
                    <div className={`mr-4 flex h-14 w-14 items-center justify-center rounded-full ${testimonial.color} font-bold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.practice}</div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Slider with navigation arrows */}
          <div className="lg:hidden relative">
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentMobileSlide * 100}%)` }}
              >
                {mobileTestimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="group relative rounded-lg md:rounded-2xl bg-background p-4 md:p-6 shadow-lg border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 rounded-lg md:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-primary/5 to-transparent"></div>
                      
                      {/* Star Rating */}
                      <div className="relative mb-3 md:mb-4 flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star 
                              key={i}
                              className="h-3 w-3 md:h-4 md:w-4 fill-current transition-transform duration-300 hover:scale-110" 
                            />
                          ))}
                        </div>
                        <div className="ml-2 md:ml-3 text-xs font-medium text-muted-foreground">
                          {testimonial.rating}.0 Rating
                        </div>
                      </div>

                      {/* Quote Icon */}
                      <div className="relative mb-3 md:mb-4">
                        <div className="absolute -top-1 -left-1 text-lg md:text-2xl text-primary/20">"</div>
                      </div>
                      
                      {/* Testimonial Text */}
                      <p className="relative mb-4 md:mb-6 leading-relaxed text-foreground text-xs md:text-sm italic">
                        "{testimonial.testimonial}"
                      </p>
                      
                      {/* Author Information */}
                      <div className="relative flex items-center">
                        <div className={`mr-2 md:mr-3 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full ${testimonial.color} font-bold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 text-xs md:text-sm`}>
                          {testimonial.initials}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-sm md:text-base">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.practice}</div>
                        </div>
                      </div>
                      
                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-lg md:rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevMobileSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            
            <button
              onClick={nextMobileSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4 text-foreground" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {mobileTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMobileSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentMobileSlide 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Website Colors */}
      <section className="relative overflow-hidden bg-primary py-12 md:py-16 lg:py-20 xl:py-24 text-primary-foreground">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-primary-foreground border border-primary-foreground/30 animate-fade-in-up mb-4 md:mb-6">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary-foreground animate-pulse"></div>
              Transform Your Practice
            </div>
            
            {/* Main Headline */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 animate-fade-in-up">
              Ready to <span className="text-secondary">Dominate</span> Local Search?
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-primary-foreground/90 mb-6 md:mb-8 animate-fade-in-up delay-200 max-w-3xl mx-auto">
              Stop losing patients to competitors. Get your free local SEO analysis and start ranking #1 for "dentist near me" in 90 days. Our dental SEO company and dentist marketing agency deliver proven results.
            </p>

            {/* CTA Button */}
            <SEOAnalysisForm 
              buttonText="Get Your Free SEO Analysis"
              buttonClassName="group h-10 md:h-12 lg:h-14 px-6 md:px-8 lg:px-10 text-sm md:text-base lg:text-lg font-bold bg-secondary hover:bg-secondary/90 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-6 md:mb-8 w-full md:w-auto cursor-pointer"
              dialogDescription="Get your personalized dental SEO services analysis and discover how to dominate your local market with the best dental SEO agency."
            />

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 animate-fade-in-up delay-400">
              <div className="flex items-center justify-center gap-2 md:gap-3 bg-primary-foreground/10 rounded-lg p-3 md:p-4 border border-primary-foreground/20">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                <span className="font-semibold text-primary-foreground text-sm md:text-base">Guaranteed #1 Rankings</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-3 bg-primary-foreground/10 rounded-lg p-3 md:p-4 border border-primary-foreground/20">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                <span className="font-semibold text-primary-foreground text-sm md:text-base">No Setup Fees</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-3 bg-primary-foreground/10 rounded-lg p-3 md:p-4 border border-primary-foreground/20">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                <span className="font-semibold text-primary-foreground text-sm md:text-base">500+ Success Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 