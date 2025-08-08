'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { motion } from 'framer-motion';
import {
    FileSearch,
    Lightbulb,
    MousePointerClick,
    Search,
    ShieldCheck,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import { useRef, useState } from 'react';

// --- Helper Components ---

// A wrapper for sections with more dynamic fade-in animation
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


// Enhanced Animated Global Map for Hero Section
const GlobalMapVisual = () => (
    <motion.div 
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto aspect-square flex items-center justify-center rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
        {/* Background Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-full"
            style={{ backgroundImage: 'url(/images/nd-map-image.webp)' }}
        />
        {/* Overlay for better visibility */}
        <div className="absolute inset-0 bg-black/20 rounded-full"></div>
        
        {/* Animated Background Glow */}
        <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 blur-3xl z-0"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Pulsing Rings */}
        <motion.div 
            className="absolute inset-6 border-4 border-primary/40 rounded-full z-20"
            animate={{ scale: [1, 1.13, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
            className="absolute inset-8 border-3 border-secondary/50 rounded-full z-20"
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
            className="absolute inset-10 border-2 border-primary/60 rounded-full z-20"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Additional outer ring for better visibility */}
        <motion.div 
            className="absolute inset-4 border-6 border-gradient-to-r from-primary to-secondary rounded-full z-20"
            style={{ borderImage: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary)) 1' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Animated Floating Dots for Depth */}
        {[0,1,2,3].map((i) => (
        <motion.div 
                key={i}
                className="absolute w-4 h-4 bg-secondary/40 rounded-full blur-md z-0"
                style={{
                    top: `${20 + i * 15}%`,
                    left: `${15 + i * 20}%`,
                }}
                animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
        ))}
        {/* Client Pins with Glow */}
        {[
            { top: '20%', left: '25%', delay: 0.5 },
            { top: '30%', right: '15%', delay: 0.8 },
            { bottom: '25%', left: '18%', delay: 1.1 },
            { bottom: '15%', right: '30%', delay: 1.4 },
            { top: '50%', left: '10%', delay: 1.7 },
            { top: '55%', right: '40%', delay: 2.0 },
        ].map((pos, i) => (
             <motion.div
                key={i}
                className="absolute z-40 p-2 sm:p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl shadow-primary/20 border-2 border-primary/30"
                style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: pos.delay }}
            >
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-secondary drop-shadow-[0_0_8px_rgba(var(--color-secondary-rgb),0.4)]" />
            </motion.div>
        ))}
    </motion.div>
);

// Interactive Case Study Slider with TypeScript support
const CaseStudySlider = () => {
    const [sliderPosition, setSliderPosition] = useState<number>(25);
    const containerRef = useRef<HTMLDivElement>(null);

    // This handler is for the initial click on the slider
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent default behavior like text selection
        e.preventDefault();

        const handleWindowMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            // Clamp the value between 0 and 100 to keep the slider within bounds
            setSliderPosition(Math.max(0, Math.min(100, percentage)));
        };

        const handleWindowMouseUp = () => {
            // Clean up listeners when the mouse is released
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };

        // Add listeners to the window to allow dragging outside the component
        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
    };
    
    // This handler is for the initial touch on the slider
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const handleWindowTouchMove = (event: TouchEvent) => {
             if (!containerRef.current) return;
             const rect = containerRef.current.getBoundingClientRect();
             const x = event.touches[0].clientX - rect.left;
             const percentage = (x / rect.width) * 100;
             setSliderPosition(Math.max(0, Math.min(100, percentage)));
        };

        const handleWindowTouchEnd = () => {
            // Clean up listeners when the touch ends
            window.removeEventListener('touchmove', handleWindowTouchMove);
            window.removeEventListener('touchend', handleWindowTouchEnd);
        };

        window.addEventListener('touchmove', handleWindowTouchMove);
        window.addEventListener('touchend', handleWindowTouchEnd);
    };

    return (
        <motion.div 
            ref={containerRef}
            className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden cursor-ew-resize bg-white dark:bg-gray-800 select-none"
            variants={fadeInUp}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* Before Image (Bottom Layer) - Shows poor SEO results */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
                 <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col items-center justify-center">
                    <p className="font-bold text-gray-500 mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base lg:text-lg">Before SEO</p>
                    <div className="w-full p-3 sm:p-4 lg:p-6 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Bright Smiles Dental</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 lg:mb-4">www.brightsmiles.com</p>
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3 lg:mb-4">
                            <div className="h-1.5 sm:h-2 lg:h-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-1.5 sm:h-2 lg:h-3 w-5/6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-1.5 sm:h-2 lg:h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-xs sm:text-sm text-gray-400">No reviews</span>
                            <span className="text-xs sm:text-sm text-gray-400">Page 3</span>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-xs sm:text-sm text-gray-400">No status available</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-xs sm:text-sm text-gray-400">No insurance info</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-lg p-2 sm:p-3 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-medium text-gray-500">Not in top results</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* After Image (Top Layer) - Shows improved SEO results */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col items-center justify-center">
                    <p className="font-bold text-primary mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base lg:text-lg">After SEO</p>
                    <motion.div 
                        className="w-full p-3 sm:p-4 lg:p-6 bg-white/95 dark:bg-gray-700/95 backdrop-blur-sm rounded-xl shadow-xl border border-primary/20 dark:border-primary/30"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div>
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1">Bright Smiles Dental</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mb-2">Dental Clinic</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">4.9</span>
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 + i * 0.1 }}
                                    >
                                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                                    </motion.div>
                                ))}
                                <span className="text-xs sm:text-sm text-gray-500 ml-1">(128)</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full"></div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Open now</span>
                                <span className="text-xs sm:text-sm text-gray-400">•</span>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">2.1 miles away</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Accepts insurance</span>
                            </div>
                        </div>
                        <motion.div 
                            className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-2 sm:p-3 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <span className="text-xs sm:text-sm font-semibold text-primary">#1 in Local Search Results</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Slider Handle */}
            <motion.div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                whileHover={{ scaleX: 1.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 -left-5 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


export default function DentalSEOMarketingPage() {
    // --- Data ---
    const services = [
        { icon: FileSearch, title: "Dental Website Audit", description: "Our comprehensive dental website audit uncovers technical issues and opportunities holding your site back from top rankings in dental marketing SEO." },
        { icon: Search, title: "Dental Keyword Research", description: "We identify the high-value keywords your local patients are searching for, including 'dentist near me' and other dental-specific terms." },
        { icon: Lightbulb, title: "Dental Keyword Gap Analysis", description: "Discover the keywords your competitors rank for in dental marketing SEO, and create a strategy to outperform them." },
        { icon: TrendingUp, title: "Dental Marketing SEO", description: "A holistic approach combining technical SEO, content, and authority to dominate search results for dental practices." },
        { icon: MousePointerClick, title: "Dental Conversion Rate Optimization", description: "We turn more of your website visitors into actual, booked appointments through targeted dental conversion rate optimization." },
        { icon: Users, title: "'Dentist Near Me' SEO", description: "Specialized dentist near me SEO strategies to ensure you appear in the top results for local dental searches." },
    ];
    
    const caseStudyResults = [
        { value: "+320%", label: "Increase in Organic Traffic" },
        { value: "70+", label: "New Patient Inquiries/Month" },
        { value: "Top 3", label: "Ranking for 15+ Keywords" },
    ];

    const pricingPlans = [
        {
            title: "Foundation", icon: Search, price: "29,999",
            description: "A comprehensive dental website audit and dental keyword research strategy to build your dental marketing SEO success.",
            features: ["Full Dental Website Audit", "In-depth Dental Keyword Research", "Dental Keyword Gap Analysis", "On-Page Optimization Plan", "Technical SEO Roadmap"],
            popular: false,
        },
        {
            title: "Growth", icon: TrendingUp, price: "59,999",
            description: "Our most popular full-service dental marketing SEO plan for aggressive, sustained growth.",
            features: ["Everything in Foundation", "Monthly Content Creation", "Local & Technical SEO", "Dental Conversion Rate Optimization", "Performance Dashboard"],
            popular: true,
        },
        {
            title: "Dominance", icon: ShieldCheck, price: "99,999",
            description: "The ultimate partnership for becoming the undisputed dental leader in your area with advanced dentist near me SEO.",
            features: ["Everything in Growth", "Advanced Link Building", "Digital PR & Outreach", "Video SEO Strategy", "Dedicated SEO Strategist"],
            popular: false,
        },
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
            <section className="relative pt-20 sm:pt-28 pb-16 sm:pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Glass effect background */}
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl -z-10"></div>
                <div className="absolute inset-0 -z-20 opacity-60">
                    <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        <motion.div variants={fadeInUp} className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                <span className="font-semibold text-xs sm:text-sm">Leading Dental SEO Agency Near Me</span>
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight whitespace-normal break-words max-w-4xl mx-auto lg:mx-0">
                            The Right Patients,<br />
                            <span className="inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold whitespace-normal break-words align-baseline">
                                Right Near You.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl lg:text-2.5xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 font-medium">
                            We're the premier dental SEO agency near me that turns <span className="font-semibold text-primary">"dentist near me"</span> searches into new patients walking through your door, no matter where your practice is located.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                            <SEOAnalysisForm
                                buttonText="Get a FREE Dental Website Audit"
                                buttonClassName="group inline-flex items-center justify-center w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-primary/30"
                                dialogDescription="Discover the hidden opportunities to grow your practice with our dental website audit."
                            />
                        </motion.div>
                    </motion.div>
                    <div className="hidden lg:flex items-center justify-center order-1 lg:order-2">
                        <GlobalMapVisual />
                    </div>
                </div>
                {/* Mobile Map Component */}
                <div className="lg:hidden mt-6 sm:mt-8 order-1">
                    <GlobalMapVisual />
                </div>
            </section>

            {/* --- Core Services Section --- */}
            <MotionSection className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-800/50 relative overflow-hidden">
                {/* Layered gradient and abstract SVG background */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-gradient-to-r from-primary/10 via-secondary/10 to-white/0 rounded-full blur-3xl"></div>
                    <svg className="absolute right-0 top-0 w-96 h-64 opacity-20" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,100 Q100,0 200,100 T400,100" stroke="url(#grad1)" strokeWidth="18" fill="none"/>
                        <defs>
                            <linearGradient id="grad1" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                                <stop stopColor="var(--color-primary)" />
                                <stop offset="1" stopColor="var(--color-secondary)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="container mx-auto px-6 text-center">
                    <motion.h2
                        variants={fadeInUp}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block animate-gradient-x relative"
                    >
                        Complete Dental Marketing SEO Solutions
                        <span className="block h-1 w-24 mx-auto mt-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        From dental website audit to advanced dental conversion rate optimization, we cover every angle of dental marketing SEO to ensure your practice grows.
                    </motion.p>
                    <motion.div
                        variants={containerVariants}
                        className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left relative z-10"
                    >
                        {services.map((service, idx) => (
                            <motion.div 
                                key={service.title} 
                                variants={cardPopIn} 
                                className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-primary/10 dark:border-primary/20 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.03]"
                                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(80,120,255,0.15)' }}
                                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                            >
                                {/* Removed Start Here badge */}
                                <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full transition-transform duration-500 group-hover:scale-[10]"></div>
                                <div className="relative z-10">
                                    <motion.div 
                                        className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-colors duration-300"
                                        whileHover={{ scale: 1.18, rotate: 8 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                    >
                                        <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                                    </motion.div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 group-hover:text-secondary/80 group-hover:dark:text-white/80 transition-colors duration-300">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
                {/* Wavy SVG divider at bottom */}
                <svg className="absolute left-0 bottom-0 w-full h-16 md:h-24" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 Q360,80 720,40 T1440,40 V80 H0 Z" fill="url(#toolkitwave)" />
                    <defs>
                        <linearGradient id="toolkitwave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="var(--color-primary)" stopOpacity="0.08" />
                            <stop offset="1" stopColor="var(--color-secondary)" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>
                </svg>
            </MotionSection>

            {/* --- Case Study Section --- */}
            <MotionSection className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-gradient-to-r from-primary/15 via-secondary/15 to-white/0 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-64 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-2xl"></div>
                    <svg className="absolute left-0 bottom-0 w-full h-24 opacity-10" viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,48 Q360,96 720,48 T1440,48 V96 H0 Z" fill="url(#casewave)" />
                        <defs>
                            <linearGradient id="casewave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                                <stop stopColor="var(--color-primary)" />
                                <stop offset="1" stopColor="var(--color-secondary)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.span 
                            variants={fadeInUp}
                            className="inline-block bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6 border border-primary/20"
                        >
                            Proven Results
                        </motion.span>
                        <motion.div variants={fadeInUp} className="mt-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block animate-gradient-x">
                                From Invisible to In-Demand with Dental Marketing SEO
                                <span className="block h-1.5 w-24 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></span>
                            </h2>
                        </motion.div>
                    </div>
                    <div className="mt-12 sm:mt-16 grid lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
                        <div className="lg:col-span-3">
                           <CaseStudySlider />
                        </div>
                        <motion.div variants={containerVariants} className="lg:col-span-2 space-y-6 sm:space-y-8">
                            {caseStudyResults.map((result, index) => (
                                <motion.div 
                                    key={result.label} 
                                    variants={fadeInUp} 
                                    className="group bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-primary/10 dark:border-primary/20 flex flex-col items-center hover:shadow-primary/10 hover:scale-105 transition-all duration-300"
                                    whileHover={{ y: -5 }}
                                >
                                    <motion.p 
                                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        {result.value}
                                    </motion.p>
                                    <p className="text-gray-600 dark:text-gray-300 text-center font-medium text-base sm:text-lg">{result.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </MotionSection>
            
            {/* --- Pricing Section --- */}
            <PricingPlans />

            {/* --- Final CTA Section --- */}
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-16 md:py-24">
                    <div className="relative bg-gradient-to-r from-primary to-secondary text-white p-6 sm:p-10 md:p-16 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-full">
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-xs sm:text-sm font-semibold">Results-Driven Guarantee</span>
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Ready to Grow Your Practice?</h2>
                            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                                Let's build a dental marketing SEO strategy that brings you a consistent flow of new, high-value patients through dentist near me SEO.
                            </p>
                            <div className="mt-6 sm:mt-8">
                                <SEOAnalysisForm
                                    buttonText="Book My Free Strategy Call"
                                    buttonClassName="group inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold bg-white text-primary rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-100"
                                    dialogDescription="Schedule your free call to get a personalized growth plan."
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}