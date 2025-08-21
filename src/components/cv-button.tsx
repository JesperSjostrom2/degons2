'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function CVButton() {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Link href="/cv">
        <motion.button
          className="px-4 py-2 bg-accent/90 hover:bg-accent text-accent-foreground rounded-full flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-300 cursor-pointer font-medium text-sm"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 25px rgba(218, 197, 167, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="w-4 h-4" />
          Resume
        </motion.button>
      </Link>
    </motion.div>
  )
}