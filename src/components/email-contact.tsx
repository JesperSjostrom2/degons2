'use client'

import { motion } from 'framer-motion'

export default function EmailContact() {
  return (
    <motion.div
      className="fixed bottom-0 right-0 flex flex-col items-center z-40"
      style={{ 
        right: '3rem',
        bottom: '0'
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      {/* Email Text */}
      <motion.div
        className="text-white/70 hover:text-white transition-colors duration-300 mb-4"
        style={{
          fontSize: '0.875rem',
          fontFamily: 'var(--font-outfit)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          letterSpacing: '0.1em'
        }}
        whileHover={{ scale: 1.05 }}
      >
        <a 
          href="mailto:contact@jespersjostrom.se"
          className="hover:text-accent transition-colors duration-300"
        >
          contact@jespersjostrom.se
        </a>
      </motion.div>
      
      {/* Vertical Line */}
      <motion.div
        className="bg-white/30"
        style={{
          width: '0.0625rem',
          height: '4rem'
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      />
    </motion.div>
  )
}