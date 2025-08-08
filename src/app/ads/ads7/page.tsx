'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    Building2,
    CheckCircle,
    Code,
    FileSearch,
    Film,
    Globe,
    HelpCircle,
    MapPin,
    MousePointerClick,
    Network,
    Star,
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

// --- Refreshed FAQ Accordion Component ---
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div variants={fadeInUp} className="border-b border-gray-200 dark:border-gray-700/80">
            <button
                className="w-full flex justify-between items-center text-left py-5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-100">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-primary'}`}
                >
                    <HelpCircle className="w-5 h-5" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <p className="pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
            </motion.div>
        </motion.div>
    );
};


export default function DentalWebsiteOptimizationPage() {
    // --- Data ---
    const services = [
        { icon: Globe, title: "Dental Website Crawlability & Technical SEO", description: "Expert dental clinic SEO services that enhance your dental website crawlability, mobile-friendliness, and speed. We optimize every technical aspect to build a strong foundation for all dental clinic SEO efforts." },
        { icon: MapPin, title: "Dental Local Citations & GMB Dominance", description: "Advanced dental local citations management and Google My Business optimization, ensuring you rank high in the local map pack and attract patients in your area through comprehensive dental directory listings." },
        { icon: Code, title: "Dental Schema Markup & Structured Data", description: "Implementing dental-specific schema markup to help search engines feature your services, treatments, and practice information directly in search results for better dental clinic SEO performance." },
        { icon: FileSearch, title: "Dental FAQ Optimization & Content Strategy", description: "Developing expert dental FAQ optimization and content that answers patient questions, targets valuable keywords, and establishes your practice as a leading authority in dental clinic SEO." },
        { icon: Network, title: "Dental Directory Listings & Authority Building", description: "Strategic dental directory listings and backlink acquisition to boost your site's domain authority, a critical factor for competitive dental clinic SEO rankings." },
        { icon: MousePointerClick, title: "Dental Video SEO & Conversion Tracking", description: "Implementing dental video SEO and call tracking to measure exactly how many new patient calls your dental clinic SEO investment generates, proving clear ROI." },
    ];

    const localAuthorityPoints = [
        { icon: Building2, title: "Dental Local Citations Management", description: "We build and manage consistent NAP (Name, Address, Phone) information across the web, a cornerstone of dental local citations and local SEO trust for any dental clinic." },
        { icon: CheckCircle, title: "Dental Directory Listings Optimization", description: "Optimizing your presence on top-tier dental directory listings and health directories to increase visibility, referral traffic, and search engine trust signals for better dental clinic SEO." },
    ];
    
    const advancedTactics = [
        { icon: Zap, title: "Dental Website Crawlability", description: "We perform in-depth technical audits to resolve issues that prevent search engines from properly indexing your site, unlocking your ranking potential." },
        { icon: Film, title: "Dental Video SEO", description: "Optimize and promote patient testimonial videos, practice tours, and educational content to engage users and rank in video search results." },
    ];

    const caseStudies = [
        { practiceType: "General Dentistry SEO", metric: "310%", result: "Increase in Organic Traffic", description: "Through comprehensive dental clinic SEO optimization and dental website crawlability improvements, we tripled their website visitors in 9 months." },
        { practiceType: "Orthodontist SEO", metric: "180%", result: "Increase in New Patient Calls", description: "Our targeted orthodontist SEO campaign and dental local citations strategy led to a verifiable surge in high-value consultation calls." },
        { practiceType: "Multi-Location Dental Clinic SEO", metric: "#1-3", result: "Rankings for 'dentist near me'", description: "Dominated the map pack across five locations using granular Google My Business optimization, dental directory listings, and localized content." },
    ];

    const processSteps = [
        { step: 1, title: "Dental Clinic SEO Discovery & Audit", description: "We start with a deep dive into your current dental website crawlability, GMB profile, and competitor landscape to identify key opportunities for dental clinic SEO improvement." },
        { step: 2, title: "Custom Dental SEO Strategy", description: "We develop a bespoke dental clinic SEO roadmap, prioritizing actions like dental schema markup, dental FAQ optimization, and content that will deliver the fastest impact." },
        { step: 3, title: "Dental Video SEO & Technical Execution", description: "Our team implements all technical fixes, optimizes your dental website crawlability, and creates high-authority content including dental video SEO for your practice." },
        { step: 4, title: "Dental SEO Case Studies & Growth", description: "Receive transparent monthly reports showing progress. Our monthly dental clinic SEO packages include ongoing optimization and dental SEO case studies to ensure sustained growth." },
    ];

    const faqs = [
        { question: "How is orthodontist SEO different from general dental clinic SEO?", answer: "Orthodontist SEO requires a more specific focus on keywords related to braces, Invisalign, and corrective procedures. The target audience is often parents or adults seeking cosmetic solutions, so dental FAQ optimization and local SEO strategies, like dental directory listings, are tailored to these specific needs." },
        { question: "What are dental local citations and why are they important?", answer: "Dental local citations are online mentions of your practice's name, address, and phone number (NAP). Consistent dental local citations on reputable dental directory listings build trust with search engines like Google, which is crucial for ranking in local search results and improving dental clinic SEO." },
        { question: "How long until I see results from my dental clinic SEO investment?", answer: "While dental website crawlability improvements can boost metrics quickly, meaningful results like increased patient calls from dental clinic SEO typically build over 4-6 months. Dental clinic SEO is a long-term strategy that delivers compounding returns." },
        { question: "Do you offer white label dental SEO services for marketing agencies?", answer: "Yes, we provide comprehensive white label dental SEO services. Agencies can leverage our specialized expertise in dental clinic SEO, dental video SEO, and dental FAQ optimization to deliver top-tier results to their dental clients under their own brand. Contact us for partnership details." }
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
                    --color-primary: #c4b5fd; /* Lavender/purple */
                    --color-secondary: #99f6e4; /* Teal/mint */
                }
            `}</style>

            {/* --- Hero Section --- */}
            <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-white dark:bg-gray-900">
                     <img
                        src="/images/nd-seo7.webp"
                        alt="Dental SEO Services Background"
                        className="w-full h-full object-cover opacity-30 dark:opacity-20"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent"></div>

                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInUp} className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-5 py-2 rounded-full border border-primary/20">
                                <Star className="w-5 h-5 text-primary" />
                                <span className="tracking-wide">Your Partner in Dental Clinic SEO</span>
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                            Attract More Patients with <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Expert Dental Clinic SEO</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            We drive practice growth with proven strategies for dental website crawlability, dental local citations, dental FAQ optimization, and measurable monthly dental clinic SEO packages designed for dentists and orthodontists.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="mt-10 max-w-2xl mx-auto">
                            <SEOAnalysisForm
                                buttonText="Get Your FREE SEO Analysis"
                                buttonClassName="group inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-100"
                                dialogDescription="Discover your practice's online potential with a custom, no-obligation SEO plan."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- Core Services Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-900/50">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-5 py-2 rounded-full border border-primary/20 mb-4">
                            <Star className="w-5 h-5 text-primary" />
                            <span className="tracking-wide">Complete SEO Solutions</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Our Comprehensive Dental Clinic SEO Services
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                        We cover every angle of dental clinic SEO, from dental website crawlability and dental local citations to dental FAQ optimization and dental video SEO.
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-left"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                variants={cardPopIn}
                                className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/60 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Icon container with enhanced styling */}
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 lg:mb-8 group-hover:bg-gradient-to-br group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-500 group-hover:scale-110">
                                    <service.icon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:text-primary/90" />
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-primary transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                        {service.description}
                                    </p>
                                </div>
                                
                                {/* Subtle border accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Local Authority Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.div variants={fadeInUp} className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary font-semibold px-5 py-2 rounded-full border border-secondary/20 mb-4">
                                <MapPin className="w-5 h-5 text-secondary" />
                                <span className="tracking-wide">Local SEO Excellence</span>
                            </div>
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            Build Unshakeable <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Local Citations</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                            Dominate the "dentist near me" searches by building a powerful and consistent local presence through dental local citations and dental directory listings.
                        </motion.p>
                    </div>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            {localAuthorityPoints.map((point, index) => (
                                <motion.div 
                                    variants={cardPopIn} 
                                    key={point.title} 
                                    className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-10 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:shadow-secondary/20 hover:border-secondary/60 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Icon container with enhanced styling */}
                                    <div className="relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6 group-hover:bg-gradient-to-br group-hover:from-secondary/25 group-hover:to-primary/25 transition-all duration-500 group-hover:scale-110">
                                        <point.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-secondary transition-all duration-500 group-hover:scale-110 group-hover:text-secondary/90"/>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-secondary transition-colors duration-300">
                                            {point.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                            {point.description}
                                        </p>
                                    </div>
                                    
                                    {/* Subtle border accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>

            {/* --- Dental SEO Case Studies Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-900/50">
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-5 py-2 rounded-full border border-primary/20 mb-4">
                            <Star className="w-5 h-5 text-primary" />
                            <span className="tracking-wide">Real Results, Real Growth</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Proven Results: <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental SEO Case Studies</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-16">
                        We deliver measurable growth. See the impact of our specialized dental clinic SEO and orthodontist SEO strategies through comprehensive dental SEO case studies.
                    </motion.p>
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {caseStudies.map((study, index) => (
                                <motion.div 
                                    key={study.practiceType} 
                                    variants={cardPopIn} 
                                    className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-10 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/60 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Category badge */}
                                    <div className="relative z-10 mb-4 sm:mb-5 lg:mb-6">
                                        <span className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-primary/20">
                                            {study.practiceType}
                                        </span>
                                    </div>
                                    
                                    {/* Metric display */}
                                    <div className="relative z-10 mb-4 sm:mb-5 lg:mb-6">
                                        <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                                            {study.metric}
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                                            {study.result}
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="relative z-10 mb-6 sm:mb-7 lg:mb-8">
                                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                            {study.description}
                                        </p>
                                    </div>
                                    
                                    {/* Verification badge */}
                                    <div className="relative z-10 mt-auto">
                                        <div className="flex items-center pt-4 sm:pt-5 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                                                <span className="text-xs sm:text-sm font-semibold text-secondary">Case Study Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Subtle border accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>

             {/* --- Our Process Section (Restyled) --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                 <div className="container mx-auto px-6 text-center">
                     <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                        Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Streamlined Dental Clinic SEO Process</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                         Our systematic approach to dental website crawlability and dental clinic SEO ensures no stone is unturned on your path to SEO success.
                    </motion.p>
                     <div className="mt-20 max-w-5xl mx-auto">
                         <div className="relative grid grid-cols-1 md:grid-cols-4 gap-x-6 sm:gap-x-8 lg:gap-x-12 gap-y-8 sm:gap-y-12 lg:gap-y-16">
                             {/* Connecting line */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                             
                             {processSteps.map((step, index) => (
                                <motion.div key={step.step} variants={fadeInUp} className="relative flex flex-col items-center text-center">
                                     <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-full text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-lg">
                                        {step.step}
                                    </div>
                                    <div className="mt-4 sm:mt-5 lg:mt-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>

            {/* --- Pricing Section --- */}
            <PricingPlans />



            {/* --- FAQ Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
                        Your Dental Clinic SEO Questions, Answered
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-center text-gray-600 dark:text-gray-400">
                        Expert answers to common questions about our dental FAQ optimization, dental local citations, and dental clinic SEO services.
                    </motion.p>
                    <div className="mt-12">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Final CTA Section --- */}
            <section className="bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-6 py-20 md:py-24">
                    <div className="relative bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 md:p-16 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden text-center">
                         <div className="absolute -bottom-16 -right-16 w-48 h-48 text-white/10">
                            <Zap fill="currentColor" className="w-full h-full" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Ready to Get More Patients with Dental Clinic SEO?</h2>
                            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                                Stop losing patients to your competitors. Let's build a powerful online presence for your dental clinic with dental website crawlability, dental local citations, and dental FAQ optimization that delivers real, measurable results.
                            </p>
                            <div className="mt-8">
                                <SEOAnalysisForm
                                    buttonText="Book My Free Strategy Call"
                                    buttonClassName="group inline-flex items-center justify-center h-14 px-10 text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Schedule your free call to get a personalized dental website optimization plan."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}