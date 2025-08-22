'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Calendar } from 'lucide-react'
import { useState } from 'react'

interface ProfileCardProps {
  name?: string
  role?: string
  location?: string
  experience?: string
  projects?: string
  avatar?: string
  bio?: string
  skills?: string[]
  social?: {
    github?: string
    linkedin?: string
    email?: string
  }
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "Jesper Sjöström",
  role = "Frontend Developer",
  location = "Stockholm, Sweden",
  experience = "5+ Years",
  projects = "50+ Projects",
  bio = "Passionate about creating exceptional digital experiences",
  social = {
    github: "https://github.com/jespersjostrom",
    linkedin: "https://linkedin.com/in/jespersjostrom",
    email: "contact@jespersjostrom.se"
  }
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main Profile Card */}
      <motion.div
        className="relative bg-gradient-to-br from-accent via-accent/95 to-accent/90 rounded-3xl p-8 shadow-2xl overflow-hidden backdrop-blur-sm"
        animate={{ 
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -2 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-black/10 blur-2xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center mb-6">
          <motion.div
            className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-xl"
            animate={{ 
              rotate: isHovered ? 2 : 0,
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 flex items-center justify-center">
              <span className="text-4xl font-bold text-white tracking-wide">JS</span>
            </div>
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
        
        <div className="relative z-10 text-center text-black">
          <motion.h3 
            className="text-2xl font-bold mb-2 tracking-wide"
            animate={{ y: isHovered ? -1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          <motion.p 
            className="text-black/80 font-semibold text-lg"
            animate={{ y: isHovered ? -1 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {role}
          </motion.p>
        </div>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{ 
            translateX: isHovered ? "200%" : "-100%"
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.div
        className="mt-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
        animate={{ 
          y: isHovered ? -2 : 0,
          scale: isHovered ? 1.01 : 1
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-white mb-1">I Code</h4>
          <p className="text-muted-foreground text-sm">{bio}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm text-muted-foreground">Experience</span>
            </div>
            <p className="text-white font-semibold">{experience}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm text-muted-foreground">Location</span>
            </div>
            <p className="text-white font-semibold text-sm">{location}</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          {social.github && (
            <motion.a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-muted-foreground/10 hover:bg-accent/20 transition-all duration-200 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.a>
          )}
          {social.linkedin && (
            <motion.a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-muted-foreground/10 hover:bg-accent/20 transition-all duration-200 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.a>
          )}
          {social.email && (
            <motion.button
              onClick={() => navigator.clipboard.writeText(social.email!)}
              className="p-3 rounded-full bg-muted-foreground/10 hover:bg-accent/20 transition-all duration-200 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileCard