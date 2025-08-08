'use client';

import PricingPlans from '@/components/PricingPlans';
import SEOAnalysisForm from '@/components/SEOAnalysisForm';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Building,
  Check,
  ChevronDown,
  Clock,
  Globe,
  HeartHandshake,
  Rocket,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';

// --- Helper Components ---

// A wrapper for sections to add consistent fade-in animation on scroll
const MotionSection = ({ children, className }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.section>
);

// FAQ Item with enhanced style
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div
            layout
            className={`group transition-all duration-300 mb-4 rounded-xl border-2 ${isOpen ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary shadow-xl' : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary/50'} cursor-pointer`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <motion.div layout className="flex justify-between items-center px-6 py-6">
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-800 dark:text-gray-100'}`}>{question}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`} />
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-6 pb-6"
                    >
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Enhanced Stats Component
const StatsCard = ({ icon: Icon, value, label, description }) => (
                    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
                                    </div>
                            </div>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{description}</p>
                    </motion.div>
    );

export default function AffordableDentalSEOPageV2() {
    // --- Data ---
    const features = [
        { icon: Target, title: "Local Dental SEO Excellence", description: "Dominate local search results with our specialized local dental SEO strategies that put your practice first when patients search for dentists in your area." },
        { icon: Globe, title: "Dental Website Speed Optimization", description: "We optimize your dental website speed for faster loading times, better user experience, and improved search rankings that drive more patient conversions." },
        { icon: Award, title: "Dental Content Marketing", description: "Our dental content marketing approach creates valuable, patient-focused content that educates, engages, and converts visitors into scheduled appointments." },
        { icon: Users, title: "Dental Competitor Analysis", description: "We conduct comprehensive dental competitor analysis to identify opportunities and position your practice ahead of local competition." },
        { icon: Zap, title: "Dental Appointment Booking SEO", description: "Optimize your dental appointment booking SEO to streamline the patient journey from search to scheduled appointment." },
        { icon: HeartHandshake, title: "Affordable Dental SEO Services", description: "Get premium dental SEO services at affordable rates designed specifically for dental practices looking to grow their patient base." },
    ];

    const processSteps = [
        { number: "01", title: "Dental SEO Analysis & Strategy", description: "We conduct comprehensive dental competitor analysis and audit your current local dental SEO performance to create a customized strategy for your practice." },
        { number: "02", title: "Implementation & Optimization", description: "Our experts implement dental website speed optimization, dental content marketing, and dental appointment booking SEO to maximize your online visibility." },
        { number: "03", title: "Monitoring & Growth", description: "We track your affordable dental SEO services performance with detailed reports and continuously optimize your local dental SEO strategy for ongoing growth." },
    ];

    const pricingPlans = [
        // Data from user's image, structured for the new component
        {
            title: "Essential",
            icon: Rocket,
            price: "13,299",
            oldPrice: "15,999",
            saveAmount: "2,700",
            description: "Perfect for new dental practices looking to establish online presence.",
            features: [
                "Website SEO Audit & Optimization", "Google My Business Setup & Optimization", "Local SEO for 1 Location",
                "Basic Keyword Research (25 keywords)", "On Page SEO (5 pages)", "Monthly Progress Reports",
                "Social Media Profile Setup", "Citation Building (10 directories)",
            ],
            keyBenefits: [
                "Improved local search visibility", "Professional online presence", "Basic analytics tracking",
            ],
            popular: false,
        },
        {
            title: "Professional",
            icon: BarChart3,
            price: "27,299",
            oldPrice: "32,999",
            saveAmount: "5,700",
            description: "Comprehensive SEO solution for established practices seeking growth.",
            features: [
                "Everything in Essential Plan", "Advanced Keyword Research (50 keywords)", "Content Marketing (4 blog posts/month)",
                "Local SEO for up to 3 Locations", "On Page SEO (15 pages)", "Competitor Analysis",
                "Google Ads Setup & Management", "Review Management System", "Advanced Analytics & Conversion Tracking",
                "Social Media Management (2 platforms)", "Citation Building (25 directories)", "Schema Markup Implementation",
            ],
            keyBenefits: [
                "Increased patient appointments", "Higher search engine rankings", "Professional content creation",
            ],
            popular: true,
        },
        {
            title: "Enterprise",
            icon: Building,
            price: "49,399",
            oldPrice: "59,999",
            saveAmount: "10,600",
            description: "Premium solution for multi-location practices and dental chains.",
            features: [
                "Everything in Professional Plan", "Premium Keyword Research (100+ keywords)", "Content Marketing (8 blog posts/month)",
                "Local SEO for Unlimited Locations", "On Page SEO (Unlimited pages)", "Advanced Competitor Intelligence",
                "Multi Platform Ads Management", "Reputation Management Suite", "Custom Landing Pages",
                "Advanced Conversion Optimization", "Full Social Media Management (5 platforms)", "Premium Citation Building (50+ directories)",
                "Technical SEO Audits", "Priority Support & Consultation",
            ],
            keyBenefits: [
                "Maximum ROI and growth", "Multi-location dominance", "Dedicated account manager",
            ],
            popular: false,
        },
    ];

    const faqs = [
        { question: "How long does it take to see results from local dental SEO?", answer: "Our affordable dental SEO services typically show significant improvements in local dental SEO rankings and patient calls within 90 days. Dental website speed optimization and dental content marketing results become visible within the first quarter, with dental appointment booking SEO improvements following shortly after." },
        { question: "What makes your dental SEO services affordable?", answer: "We focus exclusively on dental practices, allowing us to streamline dental competitor analysis and dental content marketing processes. This efficiency enables us to provide premium local dental SEO and dental appointment booking SEO services at affordable rates without compromising quality." },
        { question: "Do you provide dental website speed optimization?", answer: "Yes, dental website speed optimization is a core component of our affordable dental SEO services. We optimize your site's loading speed, which is crucial for both user experience and search rankings in local dental SEO." },
        { question: "How do you handle dental competitor analysis?", answer: "Our dental competitor analysis is comprehensive and ongoing. We analyze local competitors' local dental SEO strategies, dental content marketing approaches, and dental appointment booking SEO tactics to identify opportunities for your practice to gain competitive advantages." },
    ];

    const stats = [
        { icon: TrendingUp, value: "300%", label: "Average Traffic Increase", description: "Our clients see dramatic improvements in organic traffic" },
        { icon: Star, value: "90 Days", label: "First Results", description: "Noticeable improvements within the first quarter" },
        { icon: Shield, value: "100%", label: "White Hat SEO", description: "Safe, sustainable strategies that last" },
        { icon: Clock, value: "24/7", label: "Support Available", description: "Dedicated team ready to help anytime" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans">
            {/* --- Enhanced Hero Section --- */}
            <section className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                
                <div className="relative container mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column - Enhanced Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center lg:text-left"
                        >
                            {/* Enhanced Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-full text-sm mb-6 shadow-lg"
                            >
                                <Star className="w-4 h-4" />
                            Affordable SEO for Dental Practices
                            </motion.div>

                                                        {/* Enhanced Headline */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
                            >
                                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">More Patients.</span>
                                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Less Cost.</span>
                                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Guaranteed.</span>
                            </motion.h1>

                            {/* Enhanced Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-8 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            >
                            Transform your dental practice with our affordable dental SEO services. Our local dental SEO strategies dominate search results, optimize your dental website speed, and implement dental content marketing that converts. We specialize in dental competitor analysis and dental appointment booking SEO to fill your schedule with high-value patients.
                            </motion.p>

                            {/* Enhanced CTA Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                            <SEOAnalysisForm
                                buttonText="Get Your Free Analysis"
                                    buttonClassName="group relative w-full sm:w-auto h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-primary/30 overflow-hidden"
                                dialogDescription="Get your personalized affordable dental SEO services analysis."
                            />
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Enhanced Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative max-w-lg mx-auto">
                                {/* Main Image Container */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="/images/nd-seo3.webp" 
                                        alt="Google Maps ranking for a dental clinic" 
                                        className="w-full h-auto object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                </div>
                                
                                                                {/* Floating Stats Cards */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 1.2 }}
                                    className="absolute -left-8 top-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">+300%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Traffic Growth</div>
                                        </div>
                        </div>
                    </motion.div>

                    <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 1.4 }}
                                    className="absolute -right-8 bottom-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                                            <Star className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">#1</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Local Ranking</div>
                                        </div>
                                    </div>
                                </motion.div>
                        </div>
                    </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Stats Section --- */}
            <MotionSection className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- Features Section --- */}
            <MotionSection className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">The Smarter Way to Grow Your Practice</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                            Our affordable dental SEO services focus on what truly moves the needle for dentists. We combine local dental SEO, dental website speed optimization, and dental content marketing to build a predictable patient acquisition engine that drives real results.
                        </motion.p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:border-primary hover:-translate-y-2 hover:scale-105"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </MotionSection>

            {/* --- "How It Works" Section --- */}
            <MotionSection className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Your 3-Step Path to Dominance</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-400"
                        >
                            We've simplified the path to dental SEO success. Our affordable dental SEO services process is transparent, strategic, and built for real results in local dental SEO and dental appointment booking SEO.
                        </motion.p>
                    </div>
                    <div className="relative grid md:grid-cols-3 gap-8">
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary hidden md:block rounded-full">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-100 origin-left rounded-full"></div>
                        </div>
                        {processSteps.map((step, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl text-center group hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-primary to-secondary text-white font-bold text-xl flex items-center justify-center rounded-full border-4 border-white dark:border-gray-800 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </MotionSection>


            {/* --- Pricing Section --- */}
            <PricingPlans />

            {/* --- Enhanced FAQ Section --- */}
            <MotionSection className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Frequently Asked Questions</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-400"
                        >
                            Have questions? We have answers. Here are some of the most common queries we get from dentists.
                        </motion.p>
                    </div>
                                    <div className="max-w-5xl mx-auto my-12">
                    <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/15 rounded-3xl shadow-2xl border-l-8 border-primary dark:border-secondary p-2 md:p-4">
                        <div className="bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-8 gap-4 flex flex-col">
                                {faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <FaqItem question={faq.question} answer={faq.answer} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </MotionSection>

            {/* --- Refined Final CTA Section --- */}
            <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6 py-8 md:py-12 pb-16 md:pb-20">
                        <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative bg-gradient-to-r from-primary to-secondary text-white p-8 md:p-12 rounded-2xl shadow-xl overflow-hidden text-center max-w-5xl mx-auto"
                    >
                        {/* Subtle Background Elements */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold mb-4"
                            >
                                Ready to Fill Your Appointment Book?
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed"
                            >
                                Your free, no-obligation dental SEO analysis is the first step. Discover exactly how our affordable dental SEO services, local dental SEO strategies, and dental appointment booking SEO can help you attract more high-value patients to your practice.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex justify-center mb-6"
                            >
                                <SEOAnalysisForm
                                    buttonText="Claim My Free Analysis"
                                    buttonClassName="group h-12 px-8 text-base font-semibold bg-white text-primary shadow-lg rounded-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                                    dialogDescription="Get your free, personalized SEO analysis and growth plan."
                                />
                            </motion.div>
                            
                            {/* Enhanced Trust Indicators */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-sm text-white/90"
                            >
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto justify-center sm:justify-start">
                                    <Check className="w-4 h-4 text-green-300 flex-shrink-0" />
                                    <span className="font-medium text-center sm:text-left">No Setup Fees</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto justify-center sm:justify-start">
                                    <Check className="w-4 h-4 text-green-300 flex-shrink-0" />
                                    <span className="font-medium text-center sm:text-left">30-Day Money Back</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto justify-center sm:justify-start">
                                    <Check className="w-4 h-4 text-green-300 flex-shrink-0" />
                                    <span className="font-medium text-center sm:text-left">Cancel Anytime</span>
                                </div>
                            </motion.div>
                    </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}