import React from 'react';
import { motion } from 'motion/react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-black dark:bg-white border-2 border-black dark:border-white"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 90, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
