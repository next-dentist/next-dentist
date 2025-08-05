'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="mb-1 flex items-center gap-3">
      <div className="h-8 w-8" /> {/* Avatar placeholder */}
      <div className="bg-muted max-w-fit rounded-2xl px-4 py-2">
        <div className="flex items-center gap-1">
          <motion.div
            className="bg-muted-foreground/60 h-2 w-2 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-muted-foreground/60 h-2 w-2 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <motion.div
            className="bg-muted-foreground/60 h-2 w-2 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
}
