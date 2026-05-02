'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function CVButton() {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50 hidden lg:block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Link href="/cv">
        <motion.div
          className="inline-flex h-[42px] items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-surface)] px-4 text-sm font-medium text-[color:var(--site-text)] backdrop-blur-[4px] transition-colors duration-300 hover:border-accent/55 hover:text-accent dark:border-white/12 dark:bg-white/[0.04]"
        >
          <FileText className="w-4 h-4" />
          Resume
        </motion.div>
      </Link>
    </motion.div>
  )
}
