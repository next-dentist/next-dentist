'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ChevronDown,
    HeartHandshake,
    LineChart,
    Megaphone,
    ShieldCheck,
    Sparkles,
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
        transition={{ staggerChildren: 0.2 }}
        className={className}
    >
        {children}
    </motion.section>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const cardPopIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="overflow-hidden">
            <button
                className="w-full flex justify-between items-center text-left p-6 group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{question}</span>
                </div>
                <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }} 
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ 
                    height: isOpen ? 'auto' : 0, 
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? '0px' : '-8px'
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-6">
                    <div className="mb-4 h-px w-full bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
                </div>
            </motion.div>
        </div>
    );
};


export default function DentalWebsiteOptimizationPage() {
    // --- Data ---
    const specializedServices = [
        {
            name: "General & Cosmetic",
            icon: Sparkles,
            title: "Comprehensive Dental Practice Growth SEO",
            description: "Attract more patients seeking routine check-ups, teeth whitening, and veneers. Our dental practice growth SEO optimizes for high-intent keywords to fill your appointment book with comprehensive dental review management.",
            keyword: "dental practice growth SEO"
        },
        {
            name: "Oral Surgery",
            icon: ShieldCheck,
            title: "Expert Oral Surgeon SEO Services",
            description: "Reach patients and referring doctors seeking specialized procedures like wisdom teeth removal and dental implants with our expert oral surgeon SEO strategies and dental reputation management SEO.",
            keyword: "oral surgeon SEO"
        },
        {
            name: "Periodontics",
            icon: HeartHandshake,
            title: "Specialized Periodontist SEO Solutions",
            description: "Connect with patients needing treatment for gum disease and other periodontal issues through highly specific and effective periodontist SEO campaigns with dental review management.",
            keyword: "periodontist SEO"
        },
        {
            name: "Emergency Care",
            icon: Zap,
            title: "Urgent Emergency Dentist SEO",
            description: "Appear at the top of search results when patients urgently need you. Our emergency dentist SEO ensures you're visible in critical moments with dental reputation management SEO.",
            keyword: "emergency dentist SEO"
        },
    ];

    const reputationFeatures = [
        { icon: Star, title: "Advanced Dental Review Management", description: "Automate review requests to happy patients, building a steady stream of positive feedback on Google, Healthgrades, and more with our expert dental review management system." },
        { icon: Megaphone, title: "Proactive Dental Reputation Management SEO", description: "Get instant notifications for new reviews, allowing for swift and professional responses to mitigate negative feedback and maintain your dental reputation management SEO." },
        { icon: BarChart3, title: "Comprehensive Dental Practice Growth SEO Analytics", description: "Track your online reputation score over time with our comprehensive dental reputation management SEO analytics and dental practice growth SEO reporting." }
    ];

    const processSteps = [
        { step: 1, title: "Comprehensive Dental Practice Growth SEO Audit", description: "We start with a deep dive into your practice, goals, and competitors, including a full audit and initial dental reputation management SEO analysis for optimal dental practice growth SEO." },
        { step: 2, title: "Strategic Oral Surgeon SEO Roadmap", description: "We build a custom strategy targeting your ideal patients, whether you need oral surgeon SEO, periodontist SEO, or emergency dentist SEO with dental review management." },
        { step: 3, title: "Advanced Dental Reputation Management SEO Implementation", description: "Implementation of keyword-rich content, technical optimizations, and dental schema markup to improve search engine understanding and dental reputation management SEO." },
        { step: 4, title: "Ongoing Dental Practice Growth SEO & Reporting", description: "Ongoing link building, dental review management, and transparent reporting to ensure continuous dental practice growth SEO and dental reputation management SEO success." }
    ];

    const provenResults = [
        { practice: "Oral Surgery Associates", metric: "+150%", description: "Increase in Calls from Google Business Profile in 6 months with expert oral surgeon SEO and dental review management.", service: "Oral Surgeon SEO" },
        { practice: "Downtown Dental Spa", metric: "Top 3", description: "Ranking for 'cosmetic dentist [city]' in 4 months with comprehensive dental practice growth SEO and dental reputation management SEO.", service: "Dental Practice Growth SEO" },
        { practice: "Gables Periodontics", metric: "+95%", description: "Increase in new patient form submissions with specialized periodontist SEO and dental review management.", service: "Periodontist SEO" }
    ];

    const faqs = [
        { question: "How does oral surgeon SEO differ from general dental practice growth SEO?", answer: "Oral surgeon SEO focuses on highly specific, lower-volume keywords and often targets referring general dentists as well as patients. We tailor content and outreach to this specialized audience with comprehensive dental review management, unlike the broader approach for general dentistry." },
        { question: "What is dental review management and why is it important for dental reputation management SEO?", answer: "Dental review management is the process of actively generating, monitoring, and responding to patient reviews online. It's a core part of dental reputation management SEO, as reviews heavily influence both patient trust and local search rankings for dental practice growth SEO." },
        { question: "Can you help if I'm an emergency dentist with emergency dentist SEO?", answer: "Absolutely. Emergency dentist SEO is a specialty of ours. We focus on immediate visibility through local map pack optimization and mobile-first strategies with dental review management, ensuring patients who need urgent care can find and contact you instantly." },
        { question: "What results can I expect for my dental practice growth SEO investment?", answer: "While we don't guarantee rankings, our clients typically see a significant increase in website traffic, phone calls, and new patient bookings within 4-6 months with our dental practice growth SEO and dental reputation management SEO strategies. We provide detailed monthly reports to track your ROI." }
    ];

    const [activeTab, setActiveTab] = useState(specializedServices[0].name);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-300">
            {/* --- Global CSS Variables --- */}
            <style jsx global>{`
                :root {
                    --color-primary: #8B4513; /* Brown color */
                    --color-secondary: #99f6e4; /* Softer teal/mint */
                    --color-primary-rgb: 139, 69, 19;
                    --color-secondary-rgb: 153, 246, 228;
                }
            `}</style>

            {/* --- Hero Section --- */}
            <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-screen flex items-center">
                {/* Background Image with Enhanced Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/nd-seo9.webp" 
                        alt="Dental SEO Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
                        {/* Enhanced Badge */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-sm tracking-wide text-white">Your Partner in Dental Practice Growth</span>
                            </div>
                        </motion.div>
                        
                        {/* Enhanced Main Heading */}
                        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
                            <span className="block">Expert</span>
                            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent block">Oral Surgeon SEO</span>
                            <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent block">Dental Practice Growth SEO</span>
                        </motion.h1>
                        
                        {/* Enhanced Description */}
                        <motion.p variants={fadeInUp} className="mt-8 text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                            From specialized <span style={{color: '#FFA07A !important'}} className="font-bold drop-shadow-lg">oral surgeon SEO</span> to comprehensive <span style={{color: '#FFA07A !important'}} className="font-bold drop-shadow-lg">dental review management</span>, our <span style={{color: '#FFA07A !important'}} className="font-bold drop-shadow-lg">dental practice growth SEO</span> strategies are designed to attract your ideal patients and ensure sustainable <span style={{color: '#FFA07A !important'}} className="font-bold drop-shadow-lg">dental reputation management SEO</span> success.
                        </motion.p>
                        
                        {/* Enhanced CTA */}
                        <motion.div variants={fadeInUp} className="mt-12">
                            <SEOAnalysisForm
                                buttonText="Get Your FREE Growth Plan"
                                buttonClassName="group inline-flex items-center justify-center w-full sm:w-auto h-16 px-12 text-xl font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-white/20 backdrop-blur-sm"
                                dialogDescription="Discover your practice's true online potential with a custom, no-obligation strategy session."
                            />
                        </motion.div>
                        
                        {/* Trust Indicators */}
                        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>500+ Dental Practices Trust Us</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                <span>4.9★ Average Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>Proven Results</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            <hr className="border-gray-200 dark:border-gray-700/50" />

            {/* --- Specialized SEO Services Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900/50">
                <div className="container mx-auto px-6 text-center">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Specialized <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Oral Surgeon SEO</span> & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Periodontist SEO</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
                        Generic SEO doesn't work. We provide targeted <b className="text-primary">dental practice growth SEO</b> strategies whether you need <b className="text-primary">oral surgeon SEO</b>, <b className="text-secondary">periodontist SEO</b>, or <b className="text-primary">emergency dentist SEO</b> with comprehensive <b className="text-secondary">dental review management</b>.
                    </motion.p>
                    <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-8">
                        {specializedServices.map((service) => (
                            <motion.button
                                key={service.name}
                                onClick={() => setActiveTab(service.name)}
                                className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 border-2 ${activeTab === service.name ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50'}`}
                                whileHover={{ y: -3 }}
                            >
                                {service.name}
                            </motion.button>
                        ))}
                    </div>
                    <div className="relative mt-8">
                        {specializedServices.map((service) => (
                            activeTab === service.name && (
                                <motion.div
                                    key={service.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 sm:p-12 rounded-2xl border border-gray-200 dark:border-gray-700/50"
                                >
                                    <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                                        <div className="flex-shrink-0 w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                            <service.icon className="w-12 h-12 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-lg">{service.description}</p>
                                            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-primary/70">{service.keyword}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </div>
                </div>
            </MotionSection>

            <hr className="border-gray-200 dark:border-gray-700/50" />

            {/* --- Reputation Management Section --- */}
            <MotionSection className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-30"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            {/* Header Section */}
                            <motion.div variants={fadeInUp} className="mb-12">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-6 py-3 rounded-full mb-8 text-sm border border-primary/20 shadow-lg">
                                    <ShieldCheck className="w-5 h-5" />
                                Build Trust
                                </div>
                                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                    Expert <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Reputation Management SEO</span>
                            </motion.h2>
                                <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Excellent <b className="text-primary">dental reputation management SEO</b> is non-negotiable. We turn happy patients into your best marketing asset with proactive <b className="text-primary">dental review management</b> and comprehensive <b className="text-primary">dental practice growth SEO</b> strategies.
                            </motion.p>
                            </motion.div>

                            {/* Enhanced Features Grid */}
                            <motion.div 
                                variants={{hidden: {}, visible: {transition: {staggerChildren: 0.2}}}} 
                                className="space-y-4 sm:space-y-6"
                            >
                                {reputationFeatures.map((feature, index) => (
                                    <motion.div 
                                        variants={fadeInUp} 
                                        key={feature.title} 
                                        className="group p-4 sm:p-6 bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800/90 dark:to-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-600/60 hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden"
                                    >
                                        {/* Animated Top Border */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                                        
                                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-primary/30 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
                                                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                                                    {feature.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                                                    {feature.description}
                                                </p>
                                                <div className="flex justify-center sm:justify-start">
                                                    <span className="inline-flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        Feature #{index + 1}
                                                    </span>
                                                </div>
                                        </div>
                                        </div>
                                        
                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
                                    </motion.div>
                                ))}
                            </motion.div>


                        </div>
                        <motion.div variants={cardPopIn}>
                            <div className="relative p-4 sm:p-8 bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-800/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/20 border border-white/60 dark:border-gray-700/60 overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-full blur-2xl"></div>
                                
                                {/* Header with Overall Rating */}
                                <div className="relative mb-6 sm:mb-8 text-center">
                                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 sm:px-6 py-3 rounded-full border border-primary/20">
                                <div className="flex items-center gap-2">
                                            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">4.8</span>
                                            <div className="flex text-yellow-400">
                                                <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                            </div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Based on 500+ reviews</span>
                                    </div>
                                </div>

                                {/* Reviews Container */}
                                <div className="space-y-4 sm:space-y-6">
                                    {/* First Review */}
                                    <div className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-600/60 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg">
                                                    <span className="text-primary font-bold text-lg sm:text-xl">S</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                                <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-2 gap-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">Sarah L.</h4>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium">✓ Verified</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3">
                                                    <div className="flex text-yellow-400">
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-gray-500 font-medium">Google Review</span>
                                                        <span className="text-gray-400">• 2 weeks ago</span>
                                                    </div>
                                                </div>
                                                <blockquote className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic">
                                                    "The best dental experience I've ever had. Found them through a quick Google search and they lived up to the 5-star reviews! The staff was incredibly professional and caring."
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Second Review */}
                                    <div className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-600/60 hover:shadow-lg hover:border-secondary/30 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-secondary/20 via-secondary/10 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-secondary/30 shadow-lg">
                                                    <span className="text-secondary font-bold text-lg sm:text-xl">M</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                                <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-2 gap-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">Mike R.</h4>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium">✓ Verified</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3">
                                                    <div className="flex text-yellow-400">
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                        <Star fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-gray-500 font-medium">Healthgrades</span>
                                                        <span className="text-gray-400">• 1 week ago</span>
                                                    </div>
                                                </div>
                                                <blockquote className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic">
                                                    "Needed an emergency dentist and their practice was the first to show up. Incredibly professional and caring staff. They made a stressful situation much better."
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Stats */}
                                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/60 dark:border-gray-600/60">
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                        <div>
                                            <div className="text-xl sm:text-2xl font-bold text-primary">98%</div>
                                            <div className="text-xs text-gray-500">Response Rate</div>
                                        </div>
                                        <div>
                                            <div className="text-xl sm:text-2xl font-bold text-secondary">24h</div>
                                            <div className="text-xs text-gray-500">Avg Response</div>
                                        </div>
                                    <div>
                                            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">500+</div>
                                            <div className="text-xs text-gray-500">Reviews</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </MotionSection>

            <hr className="border-gray-200 dark:border-gray-700/50" />

            {/* --- Proven Results Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-30"></div>
                </div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    {/* Header Section */}
                    <motion.div variants={fadeInUp} className="mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-4 py-2 rounded-full mb-6 text-sm border border-primary/20">
                            <Sparkles className="w-4 h-4" />
                            Real Results
                        </div>
                        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Proven <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Practice Growth SEO</span> & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Oral Surgeon SEO</span>
                    </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            We don't just promise—we deliver. Our data-driven approach is the engine behind real <b className="text-primary">dental practice growth SEO</b>, <b className="text-secondary">oral surgeon SEO</b>, and <b className="text-primary">dental reputation management SEO</b> success.
                    </motion.p>
                    </motion.div>

                    {/* Enhanced Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                        {provenResults.map((result, index) => (
                             <motion.div
                                 key={index}
                                 variants={cardPopIn}
                                className="group relative p-4 sm:p-8 bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800/90 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 sm:hover:-translate-y-3"
                            >
                                {/* Animated Top Border */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                                
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Practice Name */}
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                        </div>
                                        <p className="text-xs sm:text-sm font-semibold text-primary">{result.practice}</p>
                                    </div>
                                    
                                    {/* Metric */}
                                    <div className="mb-3 sm:mb-4 text-center sm:text-left">
                                        <p className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none">
                                            {result.metric}
                                        </p>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="text-sm sm:text-lg font-medium text-gray-800 dark:text-white mb-4 sm:mb-6 leading-relaxed text-center sm:text-left">
                                        {result.description}
                                    </p>
                                    
                                    {/* Service Badge */}
                                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
                                        <span className="text-xs font-mono uppercase tracking-widest text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full">
                                            {result.service}
                                        </span>
                                        <div className="flex items-center gap-1 text-green-500">
                                            <span className="text-xs font-medium">✓ Verified</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
                             </motion.div>
                        ))}
                    </div>


                </div>
            </MotionSection>
            
            <hr className="border-gray-200 dark:border-gray-700/50" />

            {/* --- Our Process Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-20"></div>
                </div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    {/* Header Section */}
                    <motion.div variants={fadeInUp} className="mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-4 py-2 rounded-full mb-6 text-sm border border-primary/20">
                            <LineChart className="w-4 h-4" />
                            Strategic Process
                        </div>
                        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Roadmap to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Oral Surgeon SEO</span> & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Practice Growth SEO</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our transparent, 4-step process is the foundation for predictable and powerful <b className="text-primary">dental practice growth SEO</b>, <b className="text-secondary">oral surgeon SEO</b>, and <b className="text-primary">dental reputation management SEO</b> success.
                        </motion.p>
                    </motion.div>

                    {/* Enhanced Process Steps */}
                    <div className="relative">
                        {/* Connecting Line - hidden on small screens */}
                        <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/40 to-primary/20"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {processSteps.map((step, index) => (
                                <motion.div 
                                    key={step.step} 
                                    variants={fadeInUp}
                                    className="group relative"
                                >
                                    {/* Step Card */}
                                    <div className="relative p-8 bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800/90 dark:to-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                                        {/* Background Pattern */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Step Number */}
                                    <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 border-2 border-primary/30 rounded-full flex items-center justify-center text-primary font-bold text-3xl shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300 mx-auto">
                                            {step.step}
                                        </div>

                                        </div>
                                        
                                        {/* Content */}
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                                                {step.description}
                                            </p>
                                            
                                            {/* Step Badge */}
                                            <div className="mt-6 flex items-center justify-center">
                                                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                                    <Sparkles className="w-3 h-3" />
                                                    Step {step.step}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
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
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-30"></div>
                </div>
                
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    {/* Header Section */}
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold px-4 py-2 rounded-full mb-6 text-sm border border-primary/20">
                            <Sparkles className="w-4 h-4" />
                            Get Answers
                        </div>
                        <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Questions About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Oral Surgeon SEO</span> & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Practice Growth SEO</span>
                    </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Everything you need to know about our specialized <b className="text-primary">oral surgeon SEO</b>, <b className="text-secondary">dental practice growth SEO</b>, and <b className="text-primary">dental reputation management SEO</b> services.
                    </motion.p>
                    </motion.div>

                    {/* Enhanced FAQ Container */}
                    <motion.div 
                        variants={{hidden: {}, visible: {transition: {staggerChildren: 0.1}}}} 
                        className="space-y-4"
                    >
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="group bg-gradient-to-r from-white/90 to-white/80 dark:from-gray-800/90 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                            >
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Final CTA Section --- */}
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-20 md:py-24">
                     <div className="relative bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 md:p-16 rounded-2xl shadow-2xl shadow-primary/30 overflow-hidden text-center">
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 text-white/10 opacity-50">
                            <LineChart stroke="currentColor" strokeWidth={1} className="w-full h-full" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Ready for Expert <span className="text-white">Oral Surgeon SEO</span> & <span className="text-white">Dental Practice Growth SEO</span>?</h2>
                            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                                Stop leaving new patients to chance. Let's build a powerful online presence with expert <b className="text-white">oral surgeon SEO</b>, <b className="text-white">dental practice growth SEO</b>, and <b className="text-white">dental reputation management SEO</b> that fuels your practice's success.
                            </p>
                            <div className="mt-10">
                                <SEOAnalysisForm
                                    buttonText="Schedule My Free Growth Call"
                                    buttonClassName="group inline-flex items-center justify-center h-14 px-10 text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Book a free, no-pressure call to discuss your personalized dental practice growth SEO plan."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}