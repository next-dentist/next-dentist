'use client';

import DesignShowcase from '@/components/DesignShowcase';
import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Code,
    FileSearch,
    Globe,
    HelpCircle,
    LayoutTemplate,
    MapPin,
    Palette,
    ShieldCheck,
    Smartphone,
    TrendingUp,
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const cardPopIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20 } }
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div variants={fadeInUp} className="border-b border-gray-200 dark:border-gray-700/50 py-5">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-100 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="group-hover:text-primary transition-colors duration-300">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                    <HelpCircle className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-secondary' : 'text-primary'}`} />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, marginTop: isOpen ? '20px' : '0px' }}
                className="overflow-hidden"
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
            </motion.div>
        </motion.div>
    );
};




export default function DentalWebsiteOptimizationPage() {
    // --- Data ---
    const services = [
        { icon: Palette, title: "Custom Dental Website Design", description: "Patient‑focused dental clinic website design that reflects your brand and boosts conversions with appointment booking integration." },
        { icon: Smartphone, title: "Responsive Dentist Website Development", description: "Mobile‑friendly dental websites engineered for speed, accessibility, and SEO for dental professionals." },
        { icon: Globe, title: "Technical & On‑Page Dental SEO", description: "Comprehensive dentist website optimization: Core Web Vitals, internal linking, metadata, and structured content." },
        { icon: MapPin, title: "Local SEO for Dentists", description: "GBP optimization, citations, and location pages to grow local visibility. Ideal for multi‑location dental clinics." },
        { icon: Code, title: "Schema & HIPAA Considerations", description: "Advanced schema markup and HIPAA‑aware implementations for contact forms and patient data workflows." },
        { icon: FileSearch, title: "Dental Content Marketing", description: "Editorial strategy, service pages, blogs, and FAQs—built around high‑intent keywords like cosmetic dentist SEO services and SEO for orthodontists." },
    ];

    const designAndSeoPoints = [
        { icon: LayoutTemplate, title: "Design for Conversion", description: "Our dental website designing process prioritizes clear calls-to-action and intuitive navigation to turn visitors into appointments." },
        { icon: TrendingUp, title: "SEO-Ready from Day One", description: "We build websites with a solid SEO foundation, ensuring your beautiful new dental practice website is visible to search engines immediately." },
        { icon: ShieldCheck, title: "Built for Patient Trust", description: "A professional, modern design builds credibility. We create custom dental websites that make patients feel confident in your care." }
    ];
    
    const showcaseItems = [
        {
            title: "Dufferin Dental Clinic",
            description: "Modern family dentistry website focused on accessibility and conversions.",
            imgSrc: "/images/nd-protfolio1.webp",
            url: "https://www.dufferindentalclinic.com/",
            categories: ["Website", "General"],
        },
        {
            title: "My City Dental",
            description: "Clean, patient-first design with clear service pathways.",
            imgSrc: "/images/nd-protfolio2.webp",
            url: "https://mycitydental.ca/",
            categories: ["Website", "General"],
        },
        {
            title: "Yonge & Seven Dental",
            description: "Local practice site optimized for appointments and map visibility.",
            imgSrc: "/images/nd-protfolio3.webp",
            url: "https://www.yongeandsevendental.com/",
            categories: ["Website", "Local"],
        },
        {
            title: "Dental Lab Shop",
            description: "E‑commerce experience tailored for dental professionals.",
            imgSrc: "/images/nd-protfolio4.webp",
            url: "https://www.dentallabshop.com/",
            categories: ["E-commerce"],
        },
        {
            title: "Dental Laboratorio",
            description: "Product‑driven layout with multilingual reach.",
            imgSrc: "/images/nd-protfolio5.webp",
            url: "https://www.dentallaboratorio.com/",
            categories: ["E-commerce", "Multilingual"],
        },
        {
            title: "Esthetica India",
            description: "Premium aesthetic brand presence with strong visual storytelling.",
            imgSrc: "/images/nd-protfolio6.webp",
            url: "https://estheticaindia.com/",
            categories: ["Cosmetic", "Branding"],
        },
        {
            title: "York House",
            description: "Elegant brochure site with clear navigation and calls‑to‑action.",
            imgSrc: "/images/nd-protfolio7.webp",
            url: "https://yorkhouse.bnvvivah.com/",
            categories: ["Brochure"],
        },
        {
            title: "Care32 Dental Clinics",
            description: "Multi‑location dental brand with cohesive UX.",
            imgSrc: "/images/nd-protfolio8.webp",
            url: "https://care32dentalclinics.com/",
            categories: ["Multi-location", "Website"],
        },
    ];



    const processSteps = [
        { step: 1, title: "Discovery & Strategy", description: "We start with a deep dive into your practice, goals, and competitors to build a custom dental website design and SEO blueprint." },
        { step: 2, title: "Design & Development", description: "Our team crafts a stunning, responsive dental web design, focusing on user experience and brand identity before development." },
        { step: 3, title: "SEO & Content Integration", description: "We implement on-page SEO, local GMB optimization, and strategic content to prepare your site for launch." },
        { step: 4, title: "Launch & Optimization", description: "After launch, we monitor performance, providing ongoing support and optimization through our monthly dental SEO packages." }
    ];

    const faqs = [
        { question: "Why is custom dental website design important?", answer: "Custom dental clinic website design improves patient trust and conversion. It aligns with your brand, supports HIPAA‑compliant forms, and lays the foundation for SEO for dental professionals." },
        { question: "How long does dentist SEO take to show results?", answer: "Initial lift can appear in 4–8 weeks from technical fixes; competitive rankings usually take 3–6 months with content, links, and local SEO for dentists." },
        { question: "Can you handle a dental website redesign?", answer: "Yes. Our dental website redesign services include content audits, redirects, schema, and analytics—preserving rankings while improving UX and speed." },
        { question: "What's in your affordable dentist SEO packages?", answer: "Technical fixes, on‑page optimization, GBP management, citation building, content strategy, and reporting—bundled to match your growth stage." },
    ];
    
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-700 dark:text-gray-300 overflow-x-hidden">
            {/* --- Global CSS Variables --- */}
            <style jsx global>{`
                :root {
                    --color-primary: #c4b5fd; /* Softer lavender/purple */
                    --color-secondary: #99f6e4; /* Softer teal/mint */
                    --color-primary-rgb: 196, 181, 253;
                    --color-secondary-rgb: 153, 246, 228;
                }
                
                /* Enhanced shadow utilities */
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                /* Custom gradient animations */
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient-shift 3s ease infinite;
                }
                
                /* Enhanced hover effects */
                .group:hover .group-hover\\:shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
            
            {/* --- Hero Section --- */}
            <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background Image Covering Entire Section */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url(/images/nd-seo8.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Strong Gradient Overlay - 100% opacity on right, 0% on left */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/70 via-black/60 via-black/40 via-black/20 via-black/10 to-transparent"></div>
                    
                    {/* Additional gradient layers for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                    
                    {/* Additional Aurora Effects */}
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-secondary/20 via-transparent to-transparent blur-3xl" />
                    
                    {/* Floating Elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-l from-secondary/15 to-primary/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    
                    {/* Additional Decorative Elements */}
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-gradient-to-l from-secondary/10 to-primary/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px] lg:min-h-[700px]">
                        {/* Left Side - Empty for image background */}
                        <div className="order-2 lg:order-1"></div>

                        {/* Right Side - Content Overlay */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={fadeInUp} className="mb-6">
                                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full shadow-lg">
                                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-sm tracking-wide text-white">Dental Website Design, SEO & Growth</span>
                                    </div>
                                </motion.div>
                                
                                <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
                                    Expert Dental Website Design <br className="hidden sm:block"/> & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-none">Dental SEO Services</span>
                                </motion.h1>
                                
                                <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl md:text-2xl text-white/95 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-lg">
                                   We build responsive, patient-focused dental websites and provide end‑to‑end dentist website development with SEO for dentists to improve Google ranking for dental clinics and drive booked appointments.
                                </motion.p>
                                
                                <motion.div variants={fadeInUp} className="mt-10">
                                <SEOAnalysisForm
                                    buttonText="Get My FREE Dental SEO Analysis"
                                        buttonClassName="group relative inline-flex items-center justify-center w-full sm:w-auto h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-primary/30 active:scale-100 overflow-hidden backdrop-blur-sm border border-white/20"
                                        dialogDescription="See how our integrated design and SEO strategy can transform your practice's online presence."
                                    />
                                </motion.div>
                                
                                {/* Enhanced Stats or Trust Indicators */}
                                <motion.div 
                                    variants={fadeInUp}
                                    className="mt-16 flex flex-wrap justify-center lg:justify-start gap-8 text-white/90"
                                >
                                    <div className="text-center lg:text-left bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 shadow-lg">
                                        <div className="text-2xl font-bold text-white drop-shadow-sm">500+</div>
                                        <div className="text-sm font-medium text-white/80">Dental Websites Built</div>
                                    </div>
                                    <div className="text-center lg:text-left bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 shadow-lg">
                                        <div className="text-2xl font-bold text-white drop-shadow-sm">95%</div>
                                        <div className="text-sm font-medium text-white/80">Client Satisfaction</div>
                                    </div>
                                    <div className="text-center lg:text-left bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 shadow-lg">
                                        <div className="text-2xl font-bold text-white drop-shadow-sm">300%</div>
                                        <div className="text-sm font-medium text-white/80">Average Traffic Increase</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NEW: Beautiful Design, Powerful SEO Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-secondary/5 to-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-2xl"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <motion.div variants={fadeInUp} className="mb-6">
                            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 px-6 py-3 rounded-full shadow-lg">
                                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-200">Our Winning Formula</span>
                            </div>
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Where <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dental Website Design</span> Meets <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">SEO for Dentists</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                            Our dental practice website design pairs conversion‑led UX with dental SEO services. From mobile‑friendly dental websites to schema, page speed, and content—your online presence for dentists is built to rank and convert.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6 lg:-mt-8">
                        {designAndSeoPoints.map((point, index) => (
                            <motion.div
                                key={point.title}
                                custom={index}
                                variants={{
                                    hidden: { opacity: 0, y: 60, scale: 0.95 },
                                    visible: (i) => ({ 
                                        opacity: 1, 
                                        y: 0, 
                                        scale: 1,
                                        transition: { 
                                            duration: 0.8, 
                                            ease: "easeOut", 
                                            delay: i * 0.2,
                                            type: "spring",
                                            stiffness: 100
                                        } 
                                    })
                                }}
                                className={`relative p-6 sm:p-8 lg:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/20 dark:shadow-black/20
                                            hover:shadow-3xl hover:shadow-primary/10 transition-all duration-500 ease-out group
                                            ${index === 1 ? 'lg:scale-110 lg:z-10 lg:shadow-3xl lg:shadow-primary/20' : 'lg:mt-12'}
                                            hover:-translate-y-2 hover:scale-105`}
                            >
                                {/* Enhanced Icon Container */}
                                <div className="relative mb-6 sm:mb-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 flex items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 rounded-2xl border border-primary/30 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110">
                                        <point.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-secondary transition-all duration-300" />
                                    </div>
                                    {/* Decorative Elements */}
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
                                </div>
                                
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">{point.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{point.description}</p>
                                
                                {/* Enhanced Hover Effects */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Integrated Services Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-2xl"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 px-6 py-3 rounded-full shadow-lg">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-200">Complete Solution</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Dental Website Design, Development & SEO
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                        Full‑stack dentist website development and dental SEO services: local SEO for dentists, content marketing, schema, and site performance. Get affordable dentist SEO packages tailored to your practice.
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                custom={index}
                                variants={{
                                    hidden: { opacity: 0, y: 60, scale: 0.95 },
                                    visible: (i) => ({ 
                                        opacity: 1, 
                                        y: 0, 
                                        scale: 1,
                                        transition: { 
                                            duration: 0.8, 
                                            ease: "easeOut", 
                                            delay: i * 0.15,
                                            type: "spring",
                                            stiffness: 100
                                        } 
                                    })
                                }}
                                className="group relative bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md p-8 lg:p-10 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/20 dark:shadow-black/20 overflow-hidden transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-3xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-105"
                            >
                                {/* Enhanced Icon Container */}
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                                        <service.icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-secondary" />
                                    </div>
                                    {/* Decorative Elements */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-secondary to-primary rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                    {service.description}
                                </p>
                                
                                {/* Enhanced Hover Effects */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                                
                                {/* Floating Action Indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    

                </div>
            </MotionSection>

            {/* --- NEW: Our Design Showcase Section --- */}
            <DesignShowcase showcaseItems={showcaseItems} />

            {/* --- Our Process Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl"></div>
                    <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-2xl"></div>
                </div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 px-6 py-3 rounded-full shadow-lg">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-200">Proven Process</span>
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Your Path to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Digital Success</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                            Our 4‑step process blends dental website redesign services, content strategy, and SEO for dental clinics to deliver measurable growth.
                    </motion.p>
                    <div className="mt-20 max-w-7xl mx-auto">
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                           {/* Enhanced Connecting Line */}
                            <div className="absolute top-8 left-0 hidden lg:block w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full" aria-hidden="true">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-full animate-pulse"></div>
                            </div>
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={step.step}
                                    custom={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 60, scale: 0.95 },
                                        visible: (i) => ({ 
                                            opacity: 1, 
                                            y: 0, 
                                            scale: 1,
                                            transition: { 
                                                duration: 0.8, 
                                                ease: "easeOut", 
                                                delay: i * 0.2,
                                                type: "spring",
                                                stiffness: 100
                                            } 
                                        })
                                    }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Enhanced Step Number */}
                                    <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-primary rounded-full font-bold text-xl text-primary shadow-2xl shadow-primary/20 group-hover:shadow-3xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:border-secondary">
                                        <span className="relative z-10">{`0${step.step}`}</span>
                                        {/* Decorative Elements */}
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    </div>
                                    
                                    {/* Enhanced Content */}
                                    <div className="mt-8 relative">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{step.description}</p>
                                        
                                        {/* Hover Indicator */}
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></div>
                                    </div>
                                    
                                    {/* Enhanced Background Effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    

                </div>
            </MotionSection>

            {/* --- Pricing Section --- */}
            <PricingPlans />

            {/* --- FAQ Section --- */}
            <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
                        Dental Website Design & SEO: FAQs
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-center text-gray-600 dark:text-gray-400">
                        Answers to common questions about dentist website optimization, local SEO, and growth campaigns.
                    </motion.p>
                    <div className="mt-12">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Final CTA Section --- */}
            <section className="bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
                    <div className="relative bg-gradient-to-br from-primary to-secondary text-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden text-center">
                         <div className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 w-48 h-48 sm:w-64 sm:h-64 text-white/10 opacity-50 transform-gpu rotate-12">
                            <Zap fill="currentColor" className="w-full h-full" />
                        </div>
                        <div className="absolute -top-12 sm:-top-16 -left-12 sm:-left-16 w-40 h-40 sm:w-56 sm:h-56 text-white/10 opacity-50 transform-gpu -rotate-12">
                            <Palette fill="currentColor" className="w-full h-full" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-tight">Ready to grow with Dental Website Design + SEO?</h2>
                            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                                Get a patient‑focused, mobile‑friendly site and a proven dental marketing and SEO plan to increase calls, forms, and booked appointments.
                            </p>
                            <div className="mt-6 sm:mt-8">
                                <SEOAnalysisForm
                                    buttonText="Book My Free Dental Strategy Call"
                                    buttonClassName="group inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Schedule your free call to get a personalized dental website design and SEO plan."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}