'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Code,
    FileSearch,
    Globe,
    HelpCircle,
    MapPin,
    MousePointerClick,
    Rocket,
    Shield,
    ShieldCheck, // Replacing ShieldLock
    Star,
    Target, // New Icon
    TrendingUp, // New Icon
    Users,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';

// --- Helper Components ---

const MotionSection = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
        className={className}
    >
        {children}
    </motion.section>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const cardPopIn = {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring" as const, stiffness: 150, damping: 20 } }
};

// --- Refined FAQ Accordion Component ---
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div variants={fadeInUp} className="border-b border-primary/20 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left py-5 px-2 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
                >
                    <HelpCircle className="w-5 h-5" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? '0px' : '-16px',
                    paddingBottom: isOpen ? '20px' : '0px'
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden px-2"
            >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
            </motion.div>
        </motion.div>
    );
};


export default function DentalWebsiteOptimizationPage() {
    // --- SEO-Optimized Data with Target Keywords ---
    const services = [
        { icon: Globe, title: "Comprehensive SEO for Dentists", description: "Our specialized SEO for dentists approach combines technical optimization, mobile responsiveness, and dental Google Maps optimization to dominate local search results and attract qualified patients." },
        { icon: MapPin, title: "Advanced Dental Google Maps Optimization", description: "Expert dental Google Maps optimization strategies that position your practice at the top of local search results, driving high-intent patients directly to your practice." },
        { icon: Code, title: "Dental Schema Markup Implementation", description: "Implementing comprehensive dental schema markup so search engines better understand and feature your dental services in rich results and knowledge panels." },
        { icon: FileSearch, title: "Strategic Dental Market Research SEO", description: "Our dental market research SEO identifies high-value keywords and competitive opportunities to maximize your practice's search visibility and patient acquisition." },
        { icon: BarChart3, title: "Authoritative Backlink Building", description: "Building high-quality backlinks to increase your website's authority and outperform competitors in search rankings for dental-related keywords." },
        { icon: MousePointerClick, title: "New Patient Dental SEO", description: "Focused new patient dental SEO strategies that convert search traffic into scheduled appointments through optimized landing pages and conversion funnels." },
    ];

    const whyChooseUsPoints = [
        { icon: ShieldCheck, title: "Dental SEO Specialists", description: "We live and breathe SEO for dentists. Our focused expertise ensures strategies that are perfectly tailored to the dental industry, including dental Google Maps optimization and dental SSL certificate implementation." },
        { icon: TrendingUp, title: "Proven Patient Growth", description: "Our approach to new patient dental SEO delivers measurable increases in organic traffic and valuable new patient appointments through strategic dental market research SEO." },
        { icon: Users, title: "Your Dedicated Dental SEO Consultant", description: "Work directly with a dedicated dental SEO consultant who understands your practice's unique goals and provides transparent reporting on your dental landing page optimization progress." }
    ];

    const technicalSeoPoints = [
        { icon: Shield, title: "Dental SSL Certificate Implementation", description: "We ensure your site has a valid dental SSL certificate, securing patient data and meeting Google's security standards while improving your search rankings." },
        { icon: Rocket, title: "Core Web Vitals Speed Optimization", description: "Optimizing for lightning-fast load times and a smooth user experience, crucial ranking factors for Google that directly impact your SEO for dentists success." },
        { icon: Zap, title: "Mobile-First Indexing Optimization", description: "Ensuring your website is perfectly optimized for mobile devices, where most patients begin their search, through comprehensive dental landing page optimization." },
    ];

    const newPatientFocusPoints = [
        { icon: Target, title: "Comprehensive Dental Market Research SEO", description: "We begin with in-depth dental market research SEO to understand your competition and identify high-value opportunities for your dental SEO consultant to capitalize on." },
        { icon: FileSearch, title: "High-Converting Content Strategy", description: "Crafting compelling service pages and blog posts that resonate with potential patients and encourage them to book, supported by dental landing page optimization." },
        { icon: MousePointerClick, title: "Advanced Dental Landing Page Optimization", description: "Creating and refining targeted pages for specific services (like implants or Invisalign) to maximize conversion rates from your new patient dental SEO campaigns." },
    ];


    const processSteps = [
        { step: 1, title: "Discovery & Dental Market Research SEO", description: "We start with comprehensive dental market research SEO and a full audit of your online presence, competitors, and dental Google Maps optimization opportunities." },
        { step: 2, title: "Custom SEO for Dentists Strategy", description: "Develop a bespoke roadmap focusing on new patient dental SEO, content optimization, and dental Google Maps optimization tailored to your practice." },
        { step: 3, title: "Expert Implementation & Dental SSL Certificate", description: "Executing on-page, off-page, and technical SEO, including dental SSL certificate implementation and dental landing page optimization for maximum impact." },
        { step: 4, title: "Analyze & Refine with Dental SEO Consultant", description: "Continuous monthly optimization and reporting with your dedicated dental SEO consultant to ensure sustained growth and improved search rankings." }
    ];

    const faqs = [
        { question: "How is 'SEO for dentists' different from general SEO?", answer: "SEO for dentists is highly specialized and focuses on local search, patient trust signals, and specific dental keywords. We emphasize dental Google Maps optimization, dental SSL certificate implementation, and content that addresses patient concerns. Our dental market research SEO identifies opportunities that general SEO agencies miss." },
        { question: "What is involved in dental landing page optimization?", answer: "Dental landing page optimization involves creating focused pages for specific treatments (e.g., veneers, emergency care) with optimized content, layout, and calls-to-action. We work with your dental SEO consultant to convert visitors into appointments, providing higher ROI than just sending traffic to your homepage." },
        { question: "Why is a dental SSL certificate important for SEO?", answer: "A dental SSL certificate encrypts data between your website and visitors, protecting sensitive patient information. It's a critical trust signal for patients and a confirmed ranking factor for Google. Websites without proper dental SSL certificate implementation are often flagged as 'Not Secure' and lose ranking positions." },
        { question: "How does a dental SEO consultant help my practice grow?", answer: "A dental SEO consultant provides expert guidance and execution for your entire digital marketing strategy. They handle everything from technical audits and dental market research SEO to ongoing optimization and dental landing page optimization, freeing you to focus on patient care while ensuring your practice grows online." }
    ];
    
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-700 dark:text-gray-300">
            {/* --- Global CSS Variables --- */}
            <style jsx global>{`
                :root {
                    --color-primary: #c4b5fd; /* Softer lavender/purple */
                    --color-secondary: #99f6e4; /* Softer teal/mint */
                    --color-primary-rgb: 196, 181, 253;
                    --color-secondary-rgb: 153, 246, 228;
                }
            `}</style>
            
            {/* --- Hero Section --- */}
            <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/nd-seo6.webp"
                        alt="Dental SEO Services Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/85 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/85"></div>
                <div className="absolute inset-0 opacity-70 dark:opacity-80">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInUp} className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full shadow-lg">
                                <Star className="w-5 h-5" />
                                <span className="font-semibold text-sm tracking-wide">Expert SEO for Dentists</span>
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                            Dominate Local Search with <br className="hidden sm:block"/>
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SEO for Dentists</span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                                    className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                                ></motion.span>
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                             Expert dental Google Maps optimization, dental SSL certificate implementation, and new patient dental SEO strategies designed to grow your practice with proven results.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="mt-10">
                            <SEOAnalysisForm
                                buttonText="Get My FREE SEO Plan"
                                buttonClassName="group inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-100"
                                dialogDescription="See how we can transform your practice's online presence with a custom strategy."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- Why Choose Us Section (Restyled) --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-800/20">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-primary font-semibold px-6 py-2 rounded-full text-sm border border-primary/20 shadow-sm">
                            <ShieldCheck className="w-5 h-5" />
                            <span>Why Choose Us</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        The <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental SEO Consultant</span> Advantage
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We combine deep industry knowledge with proven SEO for dentists, dental Google Maps optimization, and dental SSL certificate expertise to deliver tangible results and a steady stream of new patients.
                    </motion.p>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseUsPoints.map((point) => (
                            <motion.div
                                key={point.title}
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/25 border border-transparent hover:border-primary/30 dark:border-gray-700 dark:hover:border-primary/40 transition-all duration-300"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-full border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                                        <point.icon className="w-10 h-10 text-primary group-hover:text-secondary transition-colors duration-300" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{point.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{point.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Enhanced Core Services Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/20 dark:via-gray-900 dark:to-gray-800/20">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full shadow-lg">
                            <Code className="w-5 h-5" />
                            <span className="font-semibold text-sm">Complete SEO Solutions</span>
                        </div>
                    </motion.div>
                                                             <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Complete SEO for Dentists{' '}
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Solutions
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        From dental Google Maps optimization and dental SSL certificate implementation to advanced new patient dental SEO and dental landing page optimization, we cover every angle to ensure your practice's success with proven strategies that drive real results.
                    </motion.p>
                    
                                         <motion.div
                         variants={containerVariants}
                         className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                     >
                         {services.map((service, index) => (
                             <motion.div
                                 key={service.title}
                                 variants={cardPopIn}
                                 whileHover={{ 
                                     y: -8, 
                                     scale: 1.02,
                                     transition: { type: "spring", stiffness: 300, damping: 20 }
                                 }}
                                 className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/25 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:border-primary/40"
                             >
                                 {/* Background gradient effect */}
                                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                 
                                 {/* Icon with enhanced styling */}
                                 <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                     <div className="flex-shrink-0 relative">
                                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-secondary/30 shadow-lg">
                                             <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-secondary transition-colors duration-500" />
                                         </div>
                                         {/* Decorative element */}
                                         <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 bg-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                                     </div>
                                     
                                     <div className="flex-1">
                                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                                             {service.title}
                                         </h3>
                                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                             {service.description}
                                         </p>
                                     </div>
                                 </div>
                                 
                                 {/* Service number badge */}
                                 <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                     {index + 1}
                                 </div>
                             </motion.div>
                         ))}
                     </motion.div>
                </div>
            </MotionSection>

            {/* --- Enhanced Technical SEO Foundations Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/20 dark:via-gray-900 dark:to-gray-800/20">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <motion.div variants={fadeInUp} className="mb-6">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-primary text-white px-6 py-3 rounded-full shadow-lg">
                                    <Rocket className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Technical Excellence</span>
                                </div>
                            </motion.div>
                            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Dental SSL Certificate &{' '}
                                </span>
                                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                    Technical Excellence
                                </span>
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                We handle the critical, behind-the-scenes optimizations that Google loves, including dental SSL certificate implementation and dental landing page optimization, ensuring your website is fast, secure, and technically sound for maximum visibility.
                            </motion.p>
                            
                            {/* Additional stats or highlights */}
                            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">99%</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Security Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">&lt;2s</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Load Time</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">A+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Performance</div>
                                </div>
                            </motion.div>
                        </div>
                        
                        <div className="space-y-6">
                            {technicalSeoPoints.map((point, index) => (
                                <motion.div 
                                    key={point.title} 
                                    variants={fadeInUp}
                                    whileHover={{ 
                                        y: -4, 
                                        scale: 1.02,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-secondary/20 dark:hover:shadow-secondary/25 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:border-secondary/40"
                                >
                                    {/* Background gradient effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Number badge */}
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 dark:from-secondary/30 dark:to-primary/30 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:from-secondary/30 group-hover:to-primary/30 shadow-lg">
                                                <point.icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors duration-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-secondary transition-colors duration-300">
                                                {point.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                                {point.description}
                                            </p>
                                            
                                            {/* Progress indicator */}
                                            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(index + 1) * 33}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>


            {/* --- Our Process Section (Restyled) --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp}>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-6 py-2 rounded-full text-sm border border-primary/20">
                            <Star className="w-5 h-5" />
                            <span>Our Proven Process</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Your 4-Step Path to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SEO for Dentists Success</span>
                    </motion.h2>
                                         <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
                         <div className="relative">
                             {/* Connection line - hidden on mobile, visible on larger screens */}
                             <div className="hidden sm:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30" aria-hidden="true"></div>
                             <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                 {processSteps.map((step) => (
                                     <motion.div key={step.step} variants={fadeInUp} className="text-center group">
                                         <div className="relative flex flex-col items-center">
                                             <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-primary rounded-full text-primary font-bold text-lg sm:text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                                 {step.step}
                                             </div>
                                             <div className="mt-4 sm:mt-6 text-center sm:text-left">
                                                 <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                                 <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                                             </div>
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                         </div>
                     </div>
                </div>
            </MotionSection>


            {/* --- Enhanced New Patient Focus Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/20 dark:via-gray-900 dark:to-gray-800/20">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg">
                            <Target className="w-5 h-5" />
                            <span className="font-semibold text-sm">Patient Acquisition Focus</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            New Patient Dental SEO &{' '}
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Dental Landing Page Optimization
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We go beyond simple rankings to focus on what truly matters: converting searchers into scheduled appointments through dental market research SEO and dental landing page optimization with proven conversion strategies.
                    </motion.p>
                    
                    {/* Success metrics */}
                    <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-8 mb-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">85%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">3.2x</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">ROI Increase</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">67%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">More Appointments</div>
                        </div>
                    </motion.div>
                    
                                         <motion.div
                         variants={containerVariants}
                         className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                     >
                         {newPatientFocusPoints.map((point, index) => (
                             <motion.div
                                 key={point.title}
                                 variants={cardPopIn}
                                 whileHover={{ 
                                     y: -8, 
                                     scale: 1.02,
                                     transition: { type: "spring", stiffness: 300, damping: 20 }
                                 }}
                                 className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/25 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:border-primary/40"
                             >
                                 {/* Background gradient effect */}
                                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                 
                                 {/* Strategy number badge */}
                                 <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                                     {index + 1}
                                 </div>
                                 
                                 {/* Icon with enhanced styling */}
                                 <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                     <div className="flex-shrink-0 relative">
                                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-secondary/30 shadow-lg">
                                             <point.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-secondary transition-colors duration-500" />
                                         </div>
                                         {/* Decorative element */}
                                         <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 bg-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                                     </div>
                                     
                                     <div className="flex-1">
                                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                                             {point.title}
                                         </h3>
                                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                             {point.description}
                                         </p>
                                         
                                         {/* Strategy impact indicator */}
                                         <div className="mt-3 sm:mt-4 flex items-center justify-center sm:justify-start gap-2">
                                             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                             <span className="text-xs text-primary font-semibold">
                                                 High Impact Strategy
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                             </motion.div>
                         ))}
                     </motion.div>
                    

                </div>
            </MotionSection>

            {/* --- Pricing Section --- */}
            <PricingPlans />



            {/* --- FAQ Section (Using restyled component) --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-800/20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
                        SEO for Dentists FAQ
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-center text-gray-600 dark:text-gray-400">
                        Everything you need to know about our dental Google Maps optimization, dental SSL certificate implementation, and dental SEO consultant services.
                    </motion.p>
                    <div className="mt-12 bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Final CTA Section --- */}
            <section className="bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 py-20 md:py-24">
                    <div className="relative bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl shadow-primary/30 overflow-hidden text-center">
                         <div className="absolute -bottom-20 -right-20 w-60 h-60 text-white/10 opacity-50 transform-gpu rotate-12">
                            <Zap fill="currentColor" className="w-full h-full" />
                        </div>
                         <div className="absolute -top-16 -left-16 w-48 h-48 text-white/10 opacity-50 transform-gpu -rotate-12">
                            <Globe fill="currentColor" className="w-full h-full" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Ready to Dominate Local Search?</h2>
                            <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                                Let's build a powerful online presence with our expert SEO for dentists, dental Google Maps optimization, and dental SSL certificate implementation. Get your free, no-obligation strategy call with our dental SEO consultant today.
                            </p>
                            <div className="mt-8">
                                <SEOAnalysisForm
                                    buttonText="Book My Free Strategy Call"
                                    buttonClassName="group inline-flex items-center justify-center h-14 px-10 text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Schedule your free call to get a personalized new patient dental SEO plan."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}