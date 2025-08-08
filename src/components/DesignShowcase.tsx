'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const cardPopIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20 } }
};

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

const DesignShowcaseCard = ({ title, description, imgSrc, url }: { title: string, description: string, imgSrc: string, url: string }) => (
    <motion.div
        variants={cardPopIn}
        layout
        className="group relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-primary/20 transition-all duration-300 will-change-transform bg-black"
        whileHover={{ y: -6 }}
    >
        <div className="relative h-64">
            <Image
                src={imgSrc}
                alt={title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority={false}
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h3 className="text-2xl font-bold text-white mb-2 transform-gpu translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out drop-shadow">{title}</h3>
            <p className="text-white/85 opacity-0 group-hover:opacity-100 transform-gpu translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75 max-w-md">
                {description}
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/90 text-gray-900 rounded-full px-4 py-2 shadow">
                    View live <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={`View ${title}`}></a>
    </motion.div>
);

interface ShowcaseItem {
    title: string;
    description: string;
    imgSrc: string;
    url: string;
    categories?: string[];
}

interface DesignShowcaseProps {
    showcaseItems: ShowcaseItem[];
}

export default function DesignShowcase({ showcaseItems }: DesignShowcaseProps) {
    return (
        <MotionSection className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10">
                    <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Design Showcase</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore real projects across dental website design, local SEO for dentists, and multi‑location growth. Every site is optimized for conversions and search.
                    </motion.p>
                </div>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {showcaseItems.map((item) => (
                        <DesignShowcaseCard key={item.title} {...item} />
                    ))}
                </motion.div>
            </div>
        </MotionSection>
    );
}
