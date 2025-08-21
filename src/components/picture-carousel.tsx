'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PictureCarouselProps {
  images?: string[]
  autoScrollDelay?: number
}

const PictureCarousel: React.FC<PictureCarouselProps> = ({
  images = [
    '/api/placeholder/300/400',
    '/api/placeholder/300/400',
    '/api/placeholder/300/400',
  ],
  autoScrollDelay = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(nextSlide, autoScrollDelay)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, autoScrollDelay])

  const getImageAtIndex = (index: number) => {
    return images[(index + images.length) % images.length]
  }

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
        {/* Three Images Container */}
        <div className="relative h-full flex items-center justify-center">
          {/* Left Image (Previous) */}
          <motion.div
            className="absolute left-2 w-20 h-28 rounded-lg overflow-hidden shadow-lg opacity-60 z-10"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              x: isHovered ? -5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/40 via-purple-600/40 to-blue-700/40 flex items-center justify-center">
              <span className="text-lg font-bold text-white/40">JS</span>
            </div>
          </motion.div>

          {/* Center Image (Current) */}
          <motion.div
            className="relative w-48 h-64 rounded-xl overflow-hidden shadow-2xl z-20"
            animate={{ 
              scale: isHovered ? 1.02 : 1,
              y: isHovered ? -2 : 0
            }}
            transition={{ duration: 0.3 }}
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: isHovered ? 1.02 : 1 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-accent/30 via-accent/20 to-accent/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/60">JS</span>
            </div>
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ 
                translateX: isHovered ? "200%" : "-100%"
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          {/* Right Image (Next) */}
          <motion.div
            className="absolute right-2 w-20 h-28 rounded-lg overflow-hidden shadow-lg opacity-60 z-10"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              x: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/40 via-purple-600/40 to-blue-700/40 flex items-center justify-center">
              <span className="text-lg font-bold text-white/40">JS</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-200 text-white z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-200 text-white z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-accent' : 'bg-white/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Auto-scroll progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
          <motion.div
            className="h-full bg-accent origin-left"
            animate={{ scaleX: isHovered ? 0 : 1 }}
            transition={{ 
              duration: isHovered ? 0.3 : autoScrollDelay / 1000,
              ease: isHovered ? "easeOut" : "linear",
              repeat: isHovered ? 0 : Infinity
            }}
            key={currentIndex}
          />
        </div>
      </div>

      {/* Info Section */}
      <motion.div
        className="mt-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
        animate={{ 
          y: isHovered ? -2 : 0,
          scale: isHovered ? 1.01 : 1
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-2">Visual Journey</h4>
          <p className="text-muted-foreground text-sm">
            A glimpse into my creative world and experiences
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PictureCarousel