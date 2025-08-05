'use client';

import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Search, Star, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export default function DentalSEOPage() {
  const [activeTab, setActiveTab] = useState('before');
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  
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

  const nextMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % mobileTestimonials.length);
  };

  const prevMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev - 1 + mobileTestimonials.length) % mobileTestimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/10 to-secondary/10 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            {/* Left Side - Content */}
            <div className="space-y-6 md:space-y-8 animate-fade-in-up order-2 lg:order-1">
              <div className="inline-block rounded-full bg-primary/10 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-primary shadow-sm">
                #1 Dental SEO Agency - 500+ Dental Practices Trust Us
            </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-foreground">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Dominate Local Search
              </span>
              <br />
                for Dental Practices
            </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground">
                Get More Patients with Local SEO That Actually Works. Rank #1 for "Dentist Near Me" & Drive 300% More Traffic to Your Practice.
              </p>
              
              <SEOAnalysisForm 
                buttonText="Get Your Free SEO Audit"
                dialogTitle="Free SEO Audit Request"
                dialogDescription="Fill out the form below to receive your comprehensive SEO audit."
                submitButtonText="Submit Audit Request"
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-xs md:text-sm">Free Local SEO Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-xs md:text-sm">Guaranteed Page 1 Rankings</span>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Image */}
            <div className="relative animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '300ms' }}>
              {/* Main Image Container */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border border-border/20 max-w-xs sm:max-w-sm md:max-w-lg mx-auto bg-gradient-to-br from-background to-card">
                {/* Image with enhanced styling */}
                <div className="relative">
                  <img 
                    src="/images/nd-seo-landin.webp" 
                    alt="Dental SEO Growth Dashboard" 
                    className="w-full h-auto object-cover max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Enhanced overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
                  
                  {/* Corner accent elements */}
                  <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-xl sm:rounded-tl-2xl md:rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-r-2 border-b-2 border-secondary/30 rounded-br-xl sm:rounded-br-2xl md:rounded-br-3xl"></div>
                </div>
                
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
              </div>
              
              {/* Enhanced floating stats with better styling */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-background/95 backdrop-blur-md rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl p-1 sm:p-2 md:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-xs sm:text-sm md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">608%</div>
                  <div className="text-xs text-muted-foreground font-medium">Traffic Increase</div>
                  <div className="mt-1 h-1 w-2 sm:w-3 md:w-4 lg:w-6 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-background/95 backdrop-blur-md rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl p-1 sm:p-2 md:p-4 shadow-lg md:shadow-xl border border-border/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
                  <div className="text-xs sm:text-sm md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">#1</div>
                  <div className="text-xs text-muted-foreground font-medium">Average Ranking</div>
                  <div className="mt-1 h-1 w-2 sm:w-3 md:w-4 lg:w-6 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SEO Matters Section */}
      <section className="bg-card py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <div className="inline-block animate-fade-in-up">
              <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                Why Local SEO Matters for <span className="text-primary relative">
                  Dental Practices
                  <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full"></div>
                </span>
            </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in-up delay-200">
              93% of patients search for "dentist near me" before choosing a practice. Without proper local SEO, you're missing out on your biggest source of new patients.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                         {[
               {
                 icon: Search,
                 title: "Local Search Dominance",
                 description: "Rank #1 for 'dentist near me' and location-based searches",
                 stat: "↑ 300% more local traffic",
                 color: "from-primary to-primary/80",
                 bgColor: "bg-primary/10",
                 iconColor: "text-primary"
               },
               {
                 icon: TrendingUp,
                 title: "Patient Acquisition",
                 description: "Convert online searches into actual dental appointments",
                 stat: "5X more new patients",
                 color: "from-secondary to-secondary/80",
                 bgColor: "bg-secondary/10",
                 iconColor: "text-secondary"
               },
               {
                 icon: Users,
                 title: "Appointment Bookings",
                 description: "Convert website visitors into scheduled dental appointments",
                 stat: "85% booking rate",
                 color: "from-primary to-secondary",
                 bgColor: "bg-primary/10",
                 iconColor: "text-primary"
               },
               {
                 icon: Star,
                 title: "Practice Growth",
                 description: "Scale your dental practice with consistent patient flow",
                 stat: "$75K+ avg revenue increase",
                 color: "from-secondary to-primary",
                 bgColor: "bg-secondary/10",
                 iconColor: "text-secondary"
               }
             ].map((item, index) => (
               <div 
                 key={index} 
                 className="group transform rounded-2xl bg-background p-8 border border-border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                 style={{ animationDelay: `${index * 200}ms` }}
               >
                 {/* Animated Background Gradient */}
                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-background/50 to-transparent"></div>
                 
                 {/* Icon Container with Animation */}
                 <div className={`relative mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl ${item.bgColor} ${item.iconColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                   <div className="absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                   <item.icon className="h-6 w-6 md:h-8 md:w-8 relative z-10" />
                 </div>
                 
                 {/* Content */}
                 <div className="relative z-10">
                   <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                   <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">{item.description}</p>
                   <div className={`text-base md:text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent animate-stat-pulse group-hover:scale-110 transition-transform duration-300`}>
                     {item.stat}
              </div>
            </div>

                 {/* Hover Effect Border */}
                 <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* SEO Banner Image Section */}
      <section className="py-8 md:py-12 relative overflow-hidden bg-gradient-to-br from-background via-card/50 to-background">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block animate-fade-in-up">
                <h2 className="mb-2 md:mb-3 text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  See Your Practice <span className="text-primary relative">
                    Dominate Local Search
                    <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full"></div>
                  </span>
                </h2>
              </div>
              <p className="mx-auto max-w-2xl text-sm md:text-base text-muted-foreground animate-fade-in-up delay-200">
                This is exactly how your dental practice will appear when patients search for "dentist near me" - at the top of Google's local results.
              </p>
            </div>

            {/* Enhanced Image Container */}
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border border-border/20 bg-gradient-to-br from-background to-card group max-w-4xl mx-auto">
              <img 
                src="/images/nd-seo-banner.webp" 
                alt="Google Search Results for 'Dentist Near Me' - Local SEO Success Example" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Enhanced overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Corner accent elements */}
              <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg sm:rounded-tl-xl md:rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-r-2 border-b-2 border-secondary/30 rounded-br-lg sm:rounded-br-xl md:rounded-br-2xl"></div>
              
              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            </div>

            {/* Key Benefits Below Image */}
            <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 mb-2">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-1">Top 3 Rankings</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Appear in Google's top 3 local results</p>
              </div>
              
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/10 mb-2">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-1">5-Star Reviews</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Build trust with positive Google reviews</p>
              </div>
              
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 mb-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-1">Local Map Presence</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Show up on Google Maps</p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Our Proven SEO Framework */}
       <section className="bg-primary py-12 md:py-20 text-primary-foreground relative overflow-hidden">
         <div className="container mx-auto px-4 md:px-6 relative z-10">
           <div className="mb-12 md:mb-16 text-center">
             <div className="inline-block animate-fade-in-up">
               <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
                 Our Proven SEO Framework
                 <div className="mt-2 h-1 w-16 md:w-24 bg-primary-foreground/30 rounded-full mx-auto animate-pulse"></div>
               </h2>
              </div>
             <p className="mx-auto max-w-3xl text-base md:text-lg lg:text-xl opacity-90 animate-fade-in-up delay-200">
               Our 5-step dental SEO framework has helped 500+ practices rank #1 for local searches and increase patient bookings by 300%.
              </p>
            </div>

                       <div className="mx-auto grid max-w-6xl gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { 
                  step: "01", 
                  title: "Local SEO Audit", 
                  description: "Comprehensive analysis of your current local search performance and competitor research",
                  icon: "🔍",
                  color: "from-primary-foreground/20 to-primary-foreground/10"
                },
                { 
                  step: "02", 
                  title: "Local Strategy", 
                  description: "Custom local SEO roadmap targeting 'dentist near me' and location-based keywords",
                  icon: "📋",
                  color: "from-primary-foreground/20 to-primary-foreground/10"
                },
                { 
                  step: "03", 
                  title: "Local Optimization", 
                  description: "Google My Business optimization, local citations, and location-based content",
                  icon: "⚡",
                  color: "from-primary-foreground/20 to-primary-foreground/10"
                },
                { 
                  step: "04", 
                  title: "Local Monitoring", 
                  description: "Real-time tracking of local rankings, Google My Business insights, and patient reviews",
                  icon: "📊",
                  color: "from-primary-foreground/20 to-primary-foreground/10"
                },
                { 
                  step: "05", 
                  title: "Local Growth", 
                  description: "Monthly reports showing local search improvements and patient acquisition metrics",
                  icon: "📈",
                  color: "from-primary-foreground/20 to-primary-foreground/10"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="group text-center animate-fade-in-up p-3 md:p-4 rounded-lg transition-all duration-300 hover:bg-primary-foreground/5"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step Number Circle */}
                  <div className="relative mb-3 md:mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary-foreground/20 text-sm md:text-xl font-bold backdrop-blur-sm transition-all duration-300 group-hover:scale-105 mx-auto">
                    <span className="relative z-10">{item.step}</span>
                    
                    {/* Connecting Line (except for last item) */}
                    {index < 4 && (
                      <div className="absolute top-1/2 -right-3 h-0.5 w-6 bg-primary-foreground/30 transform -translate-y-1/2 hidden md:block"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="mb-1 md:mb-2 text-sm md:text-lg font-bold group-hover:text-primary-foreground transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
           </div>

           {/* Progress Bar */}
           <div className="mt-16 mx-auto max-w-4xl">
             <div className="relative h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/40 to-primary-foreground/20 animate-pulse"></div>
               <div className="relative h-full bg-gradient-to-r from-primary-foreground/60 to-primary-foreground/40 rounded-full animate-pulse" style={{ width: '85%' }}></div>
             </div>
             <div className="mt-4 text-center text-sm opacity-75">
               <span className="font-semibold">95%</span> of our dental clients rank on page 1 within 90 days
             </div>
           </div>
         </div>
       </section>

             {/* Tailored for Dental Professionals Section */}
       <section className="bg-card py-12 md:py-20 relative overflow-hidden">
         <div className="container mx-auto px-4 md:px-6 relative z-10">
           <div className="mb-16 text-center">
             <div className="inline-block animate-fade-in-up">
               <h2 className="mb-6 text-4xl font-bold text-foreground lg:text-5xl">
                 Built for <span className="text-primary relative">
                   Dental Practices
                   <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full"></div>
                 </span>
               </h2>
              </div>
             <p className="mx-auto max-w-3xl text-xl text-muted-foreground animate-fade-in-up delay-200">
               Dental-specific local SEO strategies that target the exact keywords your patients are searching for.
              </p>
            </div>

           <div className="mx-auto grid max-w-6xl gap-4 md:gap-8 grid-cols-1 md:grid-cols-3">
             {[
               {
                 title: "Local Search Domination",
                 description: "Rank #1 for 'dentist near me' and location-based searches in 30 days",
                 icon: Search,
                 color: "text-primary",
                 bgColor: "bg-primary/10",
                 iconBg: "bg-primary/20"
               },
               {
                 title: "Treatment-Specific SEO",
                 description: "Target patients searching for specific dental procedures and services",
                 icon: TrendingUp,
                 color: "text-secondary",
                 bgColor: "bg-secondary/10",
                 iconBg: "bg-secondary/20"
               },
               {
                 title: "Google My Business Optimization",
                 description: "Maximize your local presence with expert GMB management and review acquisition",
                 icon: Star,
                 color: "text-primary",
                 bgColor: "bg-primary/10",
                 iconBg: "bg-primary/20"
               }
             ].map((item, index) => (
               <div 
                 key={index} 
                 className="group transform rounded-xl md:rounded-2xl bg-background p-4 md:p-8 border border-border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                 style={{ animationDelay: `${index * 200}ms` }}
               >
                 {/* Animated Background Gradient */}
                 <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-background/50 to-transparent"></div>
                 
                 {/* Icon Container with Enhanced Styling */}
                 <div className={`relative mb-3 md:mb-6 flex h-10 w-10 md:h-16 md:w-16 items-center justify-center rounded-lg md:rounded-xl ${item.iconBg} ${item.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg`}>
                   <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <item.icon className="h-5 w-5 md:h-8 md:w-8 relative z-10" />
              </div>
                 
                 {/* Content with Enhanced Typography */}
                 <div className="relative z-10">
                   <h3 className="mb-2 md:mb-4 text-lg md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                     {item.title}
              </h3>
                   <p className="text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                     {item.description}
              </p>
            </div>

                 {/* Hover Effect Border */}
                 <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
               </div>
             ))}
          </div>
        </div>
      </section>

             {/* Before & After Results */}
       <section className="bg-card py-12 md:py-16 relative overflow-hidden">
         <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-8 md:mb-12 text-center">
             <div className="inline-block animate-fade-in-up">
               <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                 Real Dental Practice Results
            </h2>
             </div>
             <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-in-up delay-200">
               See how our dental SEO services transformed these practices' local search rankings and patient acquisition.
            </p>
          </div>

           <div className="mx-auto max-w-5xl">
             <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
               {/* Before Results */}
               <div className="group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                 <div className="mb-4 md:mb-6 text-center">
                   <div className="inline-flex items-center justify-center rounded-full bg-muted px-4 md:px-6 py-2 border border-border shadow-sm">
                     <span className="text-sm md:text-lg font-bold text-muted-foreground">Before SEO</span>
              </div>
            </div>
                 <div className="relative rounded-xl md:rounded-2xl bg-gradient-to-br from-muted/20 to-muted/10 p-4 md:p-6 shadow-lg border border-border transition-all duration-300 hover:shadow-xl">
                   {/* Background Pattern */}
                   <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-muted/5 to-transparent opacity-50"></div>
                   
                   <div className="relative space-y-3 md:space-y-4">
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground/30"></div>
                         <span className="text-sm md:text-base font-semibold text-muted-foreground">"Dentist near me"</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-muted-foreground">Page 3</span>
                     </div>
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground/30"></div>
                         <span className="text-sm md:text-base font-semibold text-muted-foreground">"Dental implants"</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-muted-foreground">Page 5</span>
                     </div>
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground/30"></div>
                         <span className="text-sm md:text-base font-semibold text-muted-foreground">Monthly Traffic</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-muted-foreground">1,200 visits</span>
                     </div>
                   </div>
                 </div>
            </div>

               {/* After Results */}
               <div className="group animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                 <div className="mb-4 md:mb-6 text-center">
                   <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 md:px-6 py-2 shadow-lg">
                     <span className="text-sm md:text-lg font-bold text-primary-foreground">After SEO</span>
              </div>
            </div>
                 <div className="relative rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 md:p-6 shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl">
                   {/* Background Pattern */}
                   <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                   
                   <div className="relative space-y-3 md:space-y-4">
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/90 backdrop-blur-sm border border-primary/20 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></div>
                         <span className="text-sm md:text-base font-semibold text-foreground">"Dentist near me"</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-primary">#1 Position</span>
                     </div>
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/90 backdrop-blur-sm border border-primary/20 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></div>
                         <span className="text-sm md:text-base font-semibold text-foreground">"Dental implants"</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-primary">#2 Position</span>
                     </div>
                     <div className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-background/90 backdrop-blur-sm border border-primary/20 shadow-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></div>
                         <span className="text-sm md:text-base font-semibold text-foreground">Monthly Traffic</span>
                       </div>
                       <span className="text-lg md:text-2xl font-bold text-primary">8,500 visits</span>
                     </div>
                   </div>
            </div>
               </div>
             </div>


          </div>
        </div>
      </section>

      {/* Testimonials Section */}
       <section className="bg-card py-12 md:py-20 relative overflow-hidden">
         <div className="container mx-auto px-4 md:px-6 relative z-10">
           <div className="mb-12 md:mb-16 text-center">
             <div className="inline-block animate-fade-in-up">
               <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                 Dental Practice Success Stories
            </h2>
             </div>
             <p className="mx-auto max-w-3xl text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in-up delay-200">
                 See how our dental SEO services helped practices dominate local search and increase patient bookings.
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

             {/* Final CTA Section */}
       <section className="relative overflow-hidden bg-primary py-12 md:py-20 text-primary-foreground">
         <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
           <div className="mx-auto max-w-5xl">
             <div className="inline-block animate-fade-in-up">
               <h2 className="mb-2 md:mb-3 lg:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">
              Ready to Dominate Local Search?
            </h2>
             </div>
             <p className="mx-auto mb-4 md:mb-6 lg:mb-8 max-w-4xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed opacity-90 animate-fade-in-up delay-200">
               Join 500+ dental practices that trust us to dominate local search. Get your free local SEO audit and start ranking #1 for "dentist near me" today.
             </p>

             <SEOAnalysisForm 
               buttonText="Get Your Free SEO Audit"
               buttonClassName="group h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-primary-foreground w-full md:w-auto cursor-pointer"
               dialogTitle="Free SEO Audit Request"
               dialogDescription="Fill out the form below to receive your comprehensive SEO audit."
               submitButtonText="Submit Audit Request"
             />

             <div className="mt-8 md:mt-16 flex flex-col items-center justify-center gap-4 md:gap-8 text-xs md:text-sm opacity-90 sm:flex-row animate-fade-in-up delay-400">
               <div className="flex items-center gap-2 md:gap-3">
                 <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-secondary" />
                 <span className="font-medium">Guaranteed Page 1 Rankings</span>
               </div>
               <div className="flex items-center gap-2 md:gap-3">
                 <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-secondary" />
                 <span className="font-medium">No Long-term Contracts</span>
               </div>
               <div className="flex items-center gap-2 md:gap-3">
                 <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-secondary" />
                 <span className="font-medium">500+ Dental Practices Trust Us</span>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
