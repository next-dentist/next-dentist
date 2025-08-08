'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    ChevronRight,
    Globe,
    HelpCircle,
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
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronRight className={`w-6 h-6 text-primary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, marginTop: isOpen ? '16px' : '0px' }}
                className="overflow-hidden"
            >
                <p className="text-gray-600 dark:text-gray-400 prose prose-lg">{answer}</p>
            </motion.div>
        </motion.div>
    );
};


export default function DentalWebsiteOptimizationPage() {
    // --- Enhanced Data with New Keywords ---
    const specialties = [
        { icon: Users, title: "Cosmetic Dentist SEO", description: "Attract high-value patients seeking aesthetic treatments with targeted cosmetic dentist SEO strategies." },
        { icon: Star, title: "Dental Implant SEO", description: "Dominate search results for dental implants and capture patients ready for this transformative procedure." },
        { icon: ShieldCheck, title: "Invisalign SEO Marketing", description: "Become the go-to provider for clear aligners in your area with specialized Invisalign SEO marketing." },
        { icon: Zap, title: "Endodontist SEO", description: "Connect with referring dentists and patients in need of root canal therapy through expert endodontist SEO." },
        { icon: Globe, title: "Pediatric Dentist SEO", description: "Reach concerned parents looking for trusted dental care for their children with tailored pediatric dentist SEO." },
        { icon: TrendingUp, title: "Teeth Whitening SEO", description: "Capitalize on the popularity of teeth whitening services by ranking at the top of local search." },
    ];

    const whyChooseUsPoints = [
        { icon: CheckCircle, title: "Niche-Specific Strategies", description: "We don't do generic. We build custom campaigns for cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing." },
        { icon: TrendingUp, title: "Measurable Patient Growth", description: "Our focus is on ROI. From endodontist SEO to Invisalign SEO marketing, we track new patient calls to prove our value." },
        { icon: ShieldCheck, title: "Unmatched Dental Focus", description: "We are 100% dedicated to the dental industry, understanding the unique challenges of pediatric dentist SEO, teeth whitening SEO, and specialty practices." }
    ];
    
    const processSteps = [
        { step: "01", title: "Deep Dive & Analysis", description: "We start with a full audit, analyzing your specific goals, whether it's for cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, or Invisalign SEO marketing." },
        { step: "02", title: "Custom Strategy Design", description: "We craft a bespoke roadmap, detailing content plans for pediatric dentist SEO, teeth whitening SEO, or technical schema for cosmetic dentist SEO and dental implant SEO." },
        { step: "03", title: "Precision Implementation", description: "Our team executes with precision, from local Invisalign SEO marketing to building authority for endodontist SEO and specialty-focused keywords." },
        { step: "04", title: "Reporting & Refinement", description: "Receive clear, monthly reports showing your growth. We continually refine campaigns to ensure peak performance and ROI." }
    ];

    const faqs = [
        { question: "How is cosmetic dentist SEO different from general dental SEO?", answer: "Cosmetic dentist SEO focuses on visually-driven, high-intent keywords like 'smile makeover' or 'porcelain veneers.' It requires a portfolio-centric website, testimonial marketing, and targeting affluent demographics, unlike general SEO which might target 'emergency dentist.'" },
        { question: "What results can I expect from Invisalign SEO marketing?", answer: "A successful Invisalign SEO marketing campaign aims to rank you in the top 3 on Google Maps and organic search for terms like 'Invisalign near me.' This leads to a direct increase in consultation requests, often measurable within 3-6 months." },
        { question: "My practice focuses on dental implants. How can dental implant SEO help?", answer: "Our dental implant SEO service involves creating in-depth content about the procedure, costs, and benefits. We use advanced schema to highlight your expertise and build high-quality backlinks to establish you as the leading implant authority in your service area." },
        { question: "Is pediatric dentist SEO important for my practice?", answer: "Absolutely. Pediatric dentist SEO is crucial for reaching concerned parents looking for trusted dental care for their children. A strong pediatric dentist SEO presence builds trust and credibility, capturing both direct patient inquiries and reinforcing your reputation among referring GPs." }
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
                        src="/images/nd-seo10.webp"
                        alt="Dental SEO Services Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/60 to-white/50 dark:from-gray-900/70 dark:via-gray-900/60 dark:to-gray-900/50"></div>
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
                            <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 border border-primary/30 text-primary px-5 py-2 rounded-full shadow-lg">
                                <Star className="w-5 h-5" />
                                <span className="font-semibold text-sm tracking-wide">Specialized SEO for Dental Practices</span>
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                            Dominate Local Search with <br className="hidden sm:block"/>
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Specialized Dental SEO</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                            From cosmetic dentist SEO to dental implant SEO, we specialize in pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing. Get more high-value patients with targeted local search optimization.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="mt-10">
                            <SEOAnalysisForm
                                buttonText="Get My FREE SEO Blueprint"
                                buttonClassName="group inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-100"
                                dialogDescription="Discover your practice's true online potential. Get a custom action plan today."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* --- ENHANCED: SEO Services for Every Dental Specialty Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-900/50 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-6 py-3 rounded-full shadow-lg border border-primary/20">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-semibold text-sm tracking-wide">Specialized Solutions</span>
                        </div>
                    </motion.div>
                    
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight px-4 sm:px-0">
                        SEO Services for Every <br className="hidden sm:block"/>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Specialty</span>
                    </motion.h2>
                    
                    <motion.p variants={fadeInUp} className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        Your practice is unique. Your SEO strategy should be too. We have proven frameworks for cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing.
                    </motion.p>
                    
                    <motion.div
                        variants={containerVariants}
                        className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-0"
                    >
                        {specialties.map((service, index) => (
                            <motion.div
                                key={service.title}
                                variants={cardPopIn}
                                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-3 hover:bg-white dark:hover:bg-gray-800"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Animated background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                {/* Left accent border */}
                                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-y-110"></div>
                                
                                {/* Top accent border */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-x-110"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0 shadow-lg">
                                            <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Hover effect indicator */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                        <ChevronRight className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- RE-STYLED: Why Choose Us Section --- */}
             <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl -z-10"></div>
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div variants={fadeInUp}>
                            <motion.div variants={fadeInUp} className="mb-4">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold px-4 py-2 rounded-full text-sm border border-primary/20">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>Your Unfair Advantage</span>
                                 </div>
                            </motion.div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                A Partnership Focused on <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Your Growth</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                We're more than an agency; we're your dedicated growth partner. We dive deep into your practice's needs, whether it's cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, or Invisalign SEO marketing, to deliver results that impact your bottom line.
                            </p>
                            <div className="space-y-6">
                                {whyChooseUsPoints.map((point) => (
                                    <motion.div key={point.title} variants={fadeInUp} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-secondary/20 text-secondary rounded-full mt-1">
                                            <point.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{point.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{point.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={cardPopIn} className="relative h-96 md:h-[500px] w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                            <img src="/images/nd-seo101.webp" alt="Dental SEO Services" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </MotionSection>

            {/* --- RE-STYLED: Our Process Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-6 text-center">
                     <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Our Blueprint for <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SEO Dominance</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Our 4-step process is a proven, transparent system for achieving and sustaining top search rankings.
                    </motion.p>
                    <div className="mt-20 max-w-5xl mx-auto">
                         <div className="relative grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
                            {/* The connecting line - visible on medium screens and up */}
                            <div className="absolute top-10 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary"></div>
                            </div>
                            
                            {processSteps.map((step, index) => (
                                <motion.div key={index} variants={fadeInUp} className="relative flex flex-col items-center text-center">
                                    <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-800 border-4 border-primary rounded-full font-bold text-2xl text-primary shadow-lg">
                                        {step.step}
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>


            <PricingPlans />

            {/* --- FAQ Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-6 py-3 rounded-full shadow-lg border border-primary/20 mb-6">
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-semibold text-sm tracking-wide">Common Questions</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Your Questions, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Answered</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Clarity is key. Here are answers to common questions about our specialized dental SEO services.
                        </p>
                    </motion.div>
                    
                    <motion.div variants={containerVariants} className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="group relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                            >
                                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </MotionSection>

            {/* --- Final CTA Section --- */}
            <section className="bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 py-20 md:py-24">
                    <div className="relative bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden text-center">
                         <div className="absolute -bottom-24 -right-24 w-64 h-64 text-white/10 opacity-50">
                            <Zap fill="currentColor" className="w-full h-full animate-pulse" />
                        </div>
                         <div className="absolute -top-16 -left-16 w-48 h-48 text-white/10 opacity-50 rotate-45">
                            <Star fill="currentColor" className="w-full h-full" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold px-4 sm:px-0">Ready to Dominate Local Search with Specialized Dental SEO?</h2>
                            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-4 sm:px-0">
                                Let's build a powerful SEO engine for cosmetic dentist SEO, dental implant SEO, pediatric dentist SEO, teeth whitening SEO, and Invisalign SEO marketing. Claim your free strategy session and see the difference specialized SEO can make.
                            </p>
                            <div className="mt-8">
                                <SEOAnalysisForm
                                    buttonText="Claim My Free Strategy Call"
                                    buttonClassName="group inline-flex items-center justify-center h-14 px-10 text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Schedule your free call to get a personalized SEO plan for your dental specialty."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}