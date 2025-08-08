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
    ShieldCheck,
    Star,
    TrendingUp,
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

// --- New FAQ Accordion Component ---
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div variants={fadeInUp} className="border-b border-gray-200 dark:border-gray-700 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
                    <HelpCircle className="w-6 h-6 text-primary" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, marginTop: isOpen ? '16px' : '0px' }}
                className="overflow-hidden"
            >
                <p className="text-gray-600 dark:text-gray-400">{answer}</p>
            </motion.div>
        </motion.div>
    );
};


export default function DentalWebsiteOptimizationPage() {
    // --- Data ---
    const services = [
        { icon: Globe, title: "Dental Website Optimization", description: "Comprehensive dental website optimization including technical SEO, mobile responsiveness, and site speed improvements for better search rankings." },
        { icon: MapPin, title: "Dental Google My Business Optimization", description: "Expert dental Google My Business optimization to dominate local map pack and attract nearby patients searching for dental services." },
        { icon: Code, title: "Dental Schema Markup", description: "Implementing dental schema markup and structured data so search engines better understand and feature your dental services." },
        { icon: FileSearch, title: "Dental Content Optimization", description: "Strategic dental content optimization with keyword-targeted content that answers patient questions and drives organic traffic." },
        { icon: BarChart3, title: "Dental Backlink Analysis", description: "Comprehensive dental backlink analysis and building to increase your website's authority and search rankings." },
        { icon: MousePointerClick, title: "Dental Call Tracking SEO", description: "Advanced dental call tracking SEO to measure and optimize conversion rates from organic search traffic." },
    ];

    const whyChooseUsPoints = [
        { icon: ShieldCheck, title: "Dental SEO Specialists", description: "We exclusively focus on dental website optimization, dental Google My Business optimization, and dental schema markup for maximum results." },
        { icon: TrendingUp, title: "Proven Dental SEO Results", description: "Our dental content optimization and dental backlink analysis strategies deliver measurable increases in organic traffic and new patient appointments." },
        { icon: Users, title: "Monthly Dental SEO Packages", description: "Comprehensive monthly dental SEO packages with dental call tracking SEO to measure ROI and optimize your practice's online presence." }
    ];

    const processSteps = [
        { step: 1, title: "Dental Website Audit", description: "Comprehensive dental website optimization audit including dental Google My Business optimization analysis and competitor research." },
        { step: 2, title: "Dental SEO Strategy", description: "Custom dental SEO roadmap with dental schema markup implementation and dental content optimization planning." },
        { step: 3, title: "Dental SEO Implementation", description: "Full dental website optimization including dental backlink analysis, dental call tracking SEO setup, and technical improvements." },
        { step: 4, title: "Monthly Dental SEO Packages", description: "Ongoing monthly dental SEO packages with detailed reporting, dental call tracking SEO analysis, and continuous optimization." }
    ];

    const faqs = [
        { question: "How long does dental website optimization take to show results?", answer: "While some dental website optimization improvements can be seen within weeks, significant results from dental Google My Business optimization and dental content optimization typically take 4-6 months. Our monthly dental SEO packages ensure continuous improvement." },
        { question: "What's included in your monthly dental SEO packages?", answer: "Our monthly dental SEO packages include dental website optimization, dental Google My Business optimization, dental schema markup updates, dental content optimization, dental backlink analysis, and dental call tracking SEO to measure ROI." },
        { question: "Do you guarantee dental SEO results?", answer: "While we can't guarantee specific rankings, our dental website optimization and dental call tracking SEO strategies consistently improve visibility. We guarantee comprehensive dental SEO implementation with measurable results." },
        { question: "How does dental call tracking SEO work?", answer: "Dental call tracking SEO uses unique phone numbers to track which calls come from organic search. This helps measure the ROI of your dental website optimization efforts and optimize for better patient acquisition." }
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
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src="/images/nd-seo4.webp" 
                        alt="Dental SEO Services Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/85 to-white/80 dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900/80"></div>
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
                                <span className="font-semibold text-sm tracking-wide">Expert Dental Website Optimization</span>
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                            Dominate Local Search with <br className="hidden sm:block"/>
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental SEO Services</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                            Transform your dental practice with comprehensive dental website optimization, Google My Business optimization, and monthly dental SEO packages that drive real patient appointments.
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

            {/* --- Why Choose Us Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[30rem] h-[15rem] bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[25rem] h-[12rem] bg-gradient-to-r from-secondary/10 to-transparent rounded-full blur-2xl"></div>
                </div>
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm border border-primary/20">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Why Choose Us</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-4 sm:px-0">
                        The <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental SEO Experts</span> for Your Practice's Growth
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
                        We're dental SEO specialists with proven expertise in dental website optimization, Google My Business optimization, and monthly dental SEO packages that deliver results.
                    </motion.p>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-0">
                        {whyChooseUsPoints.map((point, index) => (
                            <motion.div 
                                key={point.title} 
                                variants={fadeInUp} 
                                className="group relative"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="relative p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300">
                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary/20 group-hover:border-t-primary/40 transition-colors duration-300"></div>
                                    
                                    {/* Enhanced icon container */}
                                    <div className="relative mb-6">
                                        <motion.div 
                                            className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                                        />
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border-2 border-primary/30 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
                                            <point.icon className="w-10 h-10 text-primary group-hover:text-secondary transition-colors duration-300" />
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                                        {point.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {point.description}
                                    </p>
                                    
                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 ease-out"></div>
                                    
                                    {/* Floating decorative elements */}
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-secondary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Bottom accent */}
                    <motion.div 
                        variants={fadeInUp}
                        className="mt-12 flex justify-center"
                    >
                        <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Core Services Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block px-4 sm:px-0">
                        Complete Dental Website Optimization Services
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
                        From dental Google My Business optimization to dental schema markup, we cover every aspect of dental SEO to maximize your online visibility.
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left px-4 sm:px-0"
                    >
                        {services.map((service) => (
                            <motion.div 
                                key={service.title} 
                                variants={cardPopIn} 
                                className="group relative bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                            >
                                <div className="absolute top-0 right-0 h-1.5 w-0 bg-gradient-to-l from-primary to-secondary transition-all duration-500 group-hover:w-full"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
                                        <service.icon className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Our Process Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-gradient-to-r from-primary/15 via-secondary/15 to-white/0 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-64 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-2xl"></div>
                </div>
                <div className="container mx-auto px-6 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm border border-primary/20">
                            <Star className="w-4 h-4" />
                            <span>Proven Process</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-4 sm:px-0">
                        Your Path to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental SEO Success</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
                        Our proven 4-step dental website optimization process ensures comprehensive dental SEO results with monthly dental SEO packages.
                    </motion.p>
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Enhanced connecting line with gradient */}
                            <div className="absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30 rounded-full" aria-hidden="true"></div>
                            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-0">
                                {processSteps.map((step, index) => (
                                    <motion.div 
                                        key={step.step} 
                                        variants={fadeInUp} 
                                        className="text-center group"
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="relative flex flex-col items-center">
                                            {/* Enhanced step circle with glow effect */}
                                            <div className="relative">
                                                <motion.div 
                                                    className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                                <div className="relative w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-800 border-4 border-gradient-to-r from-primary to-secondary rounded-full text-primary font-bold text-lg shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300 group-hover:scale-110">
                                                    {step.step}
                                                </div>
                                            </div>
                                            
                                            {/* Step content with enhanced styling */}
                                            <div className="mt-8 p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-300">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                            
                                            {/* Decorative elements */}
                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Additional decorative elements */}
                            <div className="absolute -top-8 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
                            <div className="absolute -top-4 right-1/3 w-1 h-1 bg-secondary/40 rounded-full animate-pulse animation-delay-1000"></div>
                            <div className="absolute top-4 left-1/2 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse animation-delay-2000"></div>
                        </div>
                    </div>
                    
                    {/* Bottom accent */}
                    <motion.div 
                        variants={fadeInUp}
                        className="mt-12 flex justify-center"
                    >
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Pricing Section --- */}
            {/* Assuming PricingPlans is a self-contained component */}
            <PricingPlans />

            {/* --- FAQ Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white px-4 sm:px-0">
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-center text-gray-600 dark:text-gray-400 px-4 sm:px-0">
                        Have questions? We have answers. Here are some common queries we receive.
                    </motion.p>
                    <div className="mt-12 space-y-4">
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
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold px-4 sm:px-0">Ready to Dominate Local Search?</h2>
                            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-4 sm:px-0">
                               Let's create a comprehensive dental website optimization strategy with dental Google My Business optimization and monthly dental SEO packages that drive real patient appointments.
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