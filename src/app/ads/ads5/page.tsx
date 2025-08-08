'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
    Check,
    ChevronDown,
    Clock,
    FileText,
    Globe,
    HeartHandshake,
    Lightbulb,
    MapPin,
    Monitor,
    Quote,
    Search,
    Shield,
    Star,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useRef, useState } from 'react';

// --- Reusable & Enhanced Helper Components ---

const MotionSection = ({ children, className = '' }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`py-16 md:py-24 ${className}`}
    >
        {children}
    </motion.section>
);

const SectionHeader = ({ title, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
    >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</span>
        </h2>
        {subtitle && <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">{subtitle}</p>}
    </motion.div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div
            layout
            onClick={() => setIsOpen(!isOpen)}
            className={`group transition-all duration-300 rounded-xl border ${isOpen ? 'bg-white dark:bg-gray-800/50 border-primary/50 shadow-lg' : 'bg-gray-50/50 dark:bg-gray-700/30 border-transparent hover:border-primary/30'} cursor-pointer`}
        >
            <motion.div layout className="flex justify-between items-center px-6 py-5">
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-800 dark:text-gray-100'}`}>{question}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`} />
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base px-6 pb-6">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const StatsCard = ({ icon: Icon, value, label, description }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center h-full"
    >
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{value}</div>
        <div className="text-md font-semibold text-gray-700 dark:text-gray-300 mt-1">{label}</div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
);

const TestimonialCard = ({ quote, name, practice, result }) => (
    <div className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.34rem)]">
        <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
            <Quote className="w-8 h-8 text-primary/50 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">"{quote}"</p>
            <div className="mt-6">
                <p className="font-bold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-primary dark:text-secondary">{practice}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Key Result: <span className="font-bold text-primary">{result}</span></p>
            </div>
        </div>
    </div>
);


export default function DentalSearchEngineOptimizationPage() {

    // --- Data from original component ---
    const features = [
        { icon: Search, title: "Comprehensive Dental Search Engine Optimization", description: "Our dental search engine optimization strategies dominate local search results, driving qualified patient traffic through targeted keyword optimization and technical SEO improvements." },
        { icon: MapPin, title: "Expert Dental Practice Local Listings Management", description: "We optimize your dental practice local listings across Google My Business, Bing Places, and other directories to ensure maximum visibility in local search results." },
        { icon: Globe, title: "Strategic Dental Website Structure Optimization", description: "Our dental website structure optimization improves search engine crawling, indexing, and user experience through proper site architecture and internal linking." },
        { icon: FileText, title: "Targeted Dental Service Page Optimization", description: "We optimize individual dental service page optimization for specific treatments, procedures, and patient search queries to capture high-intent traffic." },
        { icon: Monitor, title: "Advanced Dental SERP Analysis", description: "Our comprehensive dental SERP analysis identifies ranking opportunities, competitor strategies, and search intent patterns to inform your SEO strategy." },
        { icon: Users, title: "Results-Driven Dental Patient Acquisition SEO", description: "Our dental patient acquisition SEO focuses on converting search traffic into scheduled appointments through conversion-optimized landing pages and user experience." },
    ];

    const processSteps = [
        { number: "01", title: "Comprehensive Dental SEO Analysis & Strategy", description: "We conduct thorough dental search engine optimization analysis and dental SERP analysis to create a customized strategy for your practice's unique market position." },
        { number: "02", title: "Implementation & Dental Website Structure Optimization", description: "Our experts implement dental website structure optimization, dental service page optimization, and dental practice local listings management for maximum search visibility." },
        { number: "03", title: "Ongoing Dental Patient Acquisition SEO", description: "We continuously monitor and optimize your dental patient acquisition SEO performance with detailed reports and strategic adjustments for sustained growth." },
    ];
    
    const faqs = [
        { question: "How long does it take to see results from dental search engine optimization?", answer: "Our dental search engine optimization typically shows significant improvements in dental practice local listings and patient calls within 90 days. Dental website structure optimization and dental service page optimization results become visible within the first quarter, with dental patient acquisition SEO improvements following shortly after." },
        { question: "What makes your dental SEO pricing competitive?", answer: "We focus exclusively on dental practices, allowing us to streamline dental SERP analysis and dental service page optimization processes. This efficiency enables us to provide premium dental search engine optimization and dental patient acquisition SEO services at competitive rates without compromising quality." },
        { question: "Do you provide dental website structure optimization?", answer: "Yes, dental website structure optimization is a core component of our dental search engine optimization services. We optimize your site's structure, which is crucial for both search engine crawling and user experience in dental practice local listings." },
        { question: "How do you handle dental SERP analysis?", answer: "Our dental SERP analysis is comprehensive and ongoing. We analyze local competitors' dental search engine optimization strategies, dental service page optimization approaches, and dental patient acquisition SEO tactics to identify opportunities for your practice to gain competitive advantages." },
    ];

    const stats = [
        { icon: TrendingUp, value: "300%", label: "Average Traffic Increase", description: "Our dental search engine optimization delivers dramatic organic traffic improvements" },
        { icon: Star, value: "90 Days", label: "First Page Results", description: "Dental practice local listings improvements within the first quarter" },
        { icon: Shield, value: "100%", label: "White Hat SEO", description: "Safe, sustainable dental patient acquisition SEO strategies" },
        { icon: Clock, value: "24/7", label: "Support Available", description: "Dedicated team for your dental SEO pricing questions" },
    ];
    
    // --- New Data for Added Sections ---
    const whyUsPoints = [
        { icon: Target, title: "Dental Industry Specialization", description: "Our team's deep understanding of dental search engine optimization and dental SERP analysis means we create strategies that work specifically for dental practices." },
        { icon: Lightbulb, title: "Comprehensive Dental SEO Approach", description: "We go beyond basic keywords, providing dental website structure optimization and dental service page optimization to ensure superior patient journey and search rankings." },
        { icon: HeartHandshake, title: "Your Dental Practice Growth Partner", description: "We succeed when you do. We provide transparent reports on your dental patient acquisition SEO progress and are always available to strategize." },
    ];

    const testimonials = [
        { name: "Dr. Emily Carter", practice: "SmileBright Dental", quote: "Their dental search engine optimization service transformed our practice. Our dental practice local listings improved dramatically, and we're now ranking #1 for key terms in our area.", result: "+150% in new patient calls" },
        { name: "Dr. Ben Adams", practice: "City Center Dentistry", quote: "Thanks to their expert dental website structure optimization and dental service page optimization, we're now dominating local search results. The dental patient acquisition SEO strategy delivered exceptional ROI.", result: "#1 Local Map Ranking" },
        { name: "Dr. Sarah Jenkins", practice: "Lakeside Family Dental", quote: "The team's detailed dental SERP analysis gave us the competitive edge we needed. Their dental search engine optimization work has led to consistent patient growth month after month.", result: "+85% in cosmetic inquiries" },
    ];

    const processRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: processRef,
        offset: ["start end", "end start"]
    });
    const lineWidth = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "100%"]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 overflow-x-hidden">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative h-[80vh] sm:h-screen bg-white dark:bg-gray-900 overflow-hidden"
            >
                <div className="relative w-full h-full">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img 
                            src="/images/nd-seo3.webp" 
                            alt="Dental SEO optimization background" 
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                    </div>
                    
                    {/* Content Grid */}
                    <div className="relative z-10 h-full flex items-center">
                        <div className="w-full px-2 sm:px-4 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center h-full">
                                
                                {/* Left Side - Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-white space-y-6 sm:space-y-8"
                                >
                                    {/* Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full text-sm shadow-lg"
                                    >
                                        <Star className="w-4 h-4 text-primary fill-current" />
                                        #1 Dental SEO Agency
                                    </motion.div>

                                    {/* Main Headline */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight"
                                    >
                                        <span className="block text-black">Dominate Local Search</span>
                                        <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            With Dental SEO
                                        </span>
                                        <span className="block text-black">That Converts</span>
                                    </motion.h1>

                                    {/* Subtitle */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                        className="text-base sm:text-xl lg:text-2xl text-gray-800 max-w-2xl leading-relaxed"
                                    >
                                        Transform your dental practice with comprehensive dental search engine optimization that drives qualified patients to your practice through strategic dental practice local listings and dental patient acquisition SEO.
                                    </motion.p>

                                    {/* CTA Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 1.0 }}
                                    >
                                        <SEOAnalysisForm
                                            buttonText="Get Free SEO Analysis"
                                            buttonClassName="bg-gradient-to-r from-primary to-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                                            dialogDescription="Get your free, personalized dental search engine optimization analysis and growth plan."
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Right Side - Empty for Image Background */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative h-full flex items-center justify-center"
                                >
                                    {/* This space is now covered by the background image */}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [-10, 10] }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
                        className="absolute top-10 right-4 sm:top-20 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 bg-primary/20 rounded-full blur-xl"
                    ></motion.div>
                    <motion.div
                        animate={{ y: [10, -10] }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, ease: "easeInOut" }}
                        className="absolute bottom-10 right-8 sm:bottom-20 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 bg-secondary/20 rounded-full blur-xl"
                    >                    </motion.div>
                </div>
            </motion.section>
            
            {/* Enhanced Stats Section */}
            <MotionSection className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-2 sm:px-6 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Proven Dental SEO Results
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Our dental search engine optimization strategies deliver measurable improvements that transform dental practices through effective dental patient acquisition SEO
                        </p>
                    </motion.div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                        {stats.map((stat, index) => (
                           <motion.div
                             key={index}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.15,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    y: -8, 
                                    scale: 1.05,
                                    transition: { duration: 0.3 }
                                }}
                                className="group"
                            >
                                                                 <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transform transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                                     {/* Hover Effect Overlay */}
                                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                     
                                     {/* Icon Container */}
                                     <div className="relative z-10">
                                         <div className="mx-auto w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                             <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                                         </div>
                                         
                                         {/* Value */}
                                         <div className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                                             {stat.value}
                                         </div>
                                         
                                         {/* Label */}
                                         <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                             {stat.label}
                                         </div>
                                         
                                         {/* Description */}
                                         <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                             {stat.description}
                                         </p>
                                         
                                         {/* Animated Underline */}
                                         <div className="mt-2 sm:mt-3 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                     </div>
                                 </div>
                           </motion.div>
                        ))}
                    </div>

                    
                </div>
            </MotionSection>

            {/* Why Choose Us Section (NEW) */}
            <MotionSection className="bg-white dark:bg-gray-900">
                <div className="container mx-auto px-2 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        title="The Dental SEO Specialist Advantage"
                        subtitle="We combine deep dental industry knowledge with cutting-edge dental search engine optimization to create growth engines for practices like yours."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-6 sm:space-y-8">
                           {whyUsPoints.map((point, index) => (
                               <motion.div 
                                 key={index}
                                 initial={{ opacity: 0, x: -30 }}
                                 whileInView={{ opacity: 1, x: 0 }}
                                 viewport={{ once: true, amount: 0.5 }}
                                 transition={{ duration: 0.6, delay: index * 0.2 }}
                                 className="flex items-start gap-4"
                               >
                                   <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl flex items-center justify-center">
                                       <point.icon className="w-6 h-6 text-primary" />
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{point.title}</h3>
                                       <p className="text-gray-600 dark:text-gray-400">{point.description}</p>
                                   </div>
                               </motion.div>
                           ))}
                        </div>
                        <motion.div 
                           initial={{ opacity: 0, scale: 0.9 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true, amount: 0.5 }}
                           transition={{ duration: 0.7 }}
                              className="relative w-full max-w-xs sm:w-96 h-56 sm:h-80 hidden md:block"
                        >
                               <img src="/images/nd-seo5.webp" alt="Dental SEO optimization showing improved search rankings" className="w-full h-full object-cover rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-2xl"></div>
                        </motion.div>
                       </div>
                    </div>
                </div>
            </MotionSection>
            
            {/* Enhanced Features Section */}
            <MotionSection className="relative bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-2 sm:px-6 relative z-10">
                    <SectionHeader
                        title="Complete Dental Search Engine Optimization Solutions"
                        subtitle="Our dental SEO services focus on what truly moves the needle. We build a predictable dental patient acquisition SEO engine that drives real results for your practice."
                    />
                    
                    {/* Enhanced Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.15,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    y: -12, 
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transform transition-all duration-300 hover:shadow-xl hover:border-primary/30 overflow-hidden">
                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon Container */}
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                        </div>
                                        
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        
                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                        
                                        {/* Animated Underline */}
                                        <div className="mt-4 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    

                </div>
            </MotionSection>

            {/* Enhanced Process Section */}
            <MotionSection className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-2 sm:px-6 relative z-10">
                    <SectionHeader
                        title="Your 3-Step Path to Dental Search Dominance"
                        subtitle="Our dental search engine optimization process is transparent, strategic, and built for real results in dental practice local listings and dental patient acquisition SEO."
                    />
                    
                    {/* Enhanced Process Steps */}
                    <div ref={processRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Connecting Line */}
                        <div className="absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-secondary/20 hidden md:block rounded-full">
                            <motion.div style={{ width: lineWidth }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                        </div>
                        
                        {processSteps.map((step, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.2,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    y: -8, 
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative z-10"
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full transform transition-all duration-500 hover:shadow-2xl hover:border-primary/30 overflow-hidden">
                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Step Number */}
                                    <div className="relative z-10 text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-gray-900">
                                    {step.number}
                                </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 text-center">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-primary transition-colors duration-300">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                            {step.description}
                                        </p>
                                        
                                        {/* Progress Indicator */}
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                                                <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative Elements */}
                                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-lg"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                </div>
            </MotionSection>

            {/* Enhanced Testimonials Section */}
            <MotionSection className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-2 sm:px-6 relative z-10">
                    <SectionHeader
                        title="Proven Dental SEO Results for Practices Like Yours"
                        subtitle="Don't just take our word for it. See how we've helped other dentists with their dental patient acquisition SEO and dental search engine optimization."
                    />
                    
                    {/* Enhanced Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                           {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.2,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ 
                                    y: -8, 
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className="group"
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 h-full transform transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden">
                                    {/* Quote Icon */}
                                    <div className="relative z-10 mb-4">
                                        <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                            <Quote className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                    
                                    {/* Quote Text */}
                                    <div className="relative z-10 mb-6">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                            "{testimonial.quote}"
                                        </p>
                                    </div>
                                    
                                    {/* Author Info */}
                                    <div className="relative z-10 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-primary text-sm">
                                                    {testimonial.practice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Key Result */}
                                    <div className="relative z-10">
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                                    <TrendingUp className="w-3 h-3 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Key Result</p>
                                                    <p className="text-sm font-bold text-primary">
                                                        {testimonial.result}
                                                    </p>
                                                </div>
                                            </div>
                        </div>
                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                </div>
            </MotionSection>

            {/* Pricing Section */}
            <PricingPlans />

            {/* FAQ Section */}
            <MotionSection className="bg-white dark:bg-gray-900">
                <div className="container mx-auto px-2 sm:px-6">
                    <SectionHeader
                        title="Frequently Asked Questions"
                        subtitle="Have questions about our dental SEO pricing or process? We have answers."
                    />
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-3 sm:space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.8 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <FaqItem question={faq.question} answer={faq.answer} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MotionSection>
            
            {/* Final CTA Section */}
            <section className="bg-gray-100 dark:bg-gray-800/50">
                <div className="container mx-auto px-2 sm:px-6 py-12 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-8 md:p-16 rounded-3xl shadow-2xl overflow-hidden text-center max-w-5xl mx-auto"
                    >
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full opacity-50"></div>
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Dominate Dental Search Results?</h2>
                            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                                Your free, no-obligation dental search engine optimization analysis is the first step. Discover exactly how our dental practice local listings and dental patient acquisition SEO can attract more high-value patients to your practice.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4 sm:gap-0">
                                <SEOAnalysisForm
                                    buttonText="Claim My Free Analysis"
                                    buttonClassName="group h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white text-primary shadow-lg rounded-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center gap-2"
                                    dialogDescription="Get your free, personalized dental search engine optimization analysis and growth plan."
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80 mt-8">
                                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-300" />No Setup Fees</span>
                                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-300" />Cancel Anytime</span>
                                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-300" />100% Confidential</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}