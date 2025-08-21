'use client'

import { Github, Linkedin, Mail } from 'lucide-react'

export default function SocialLinks() {
  return (
    <div className="flex gap-4 mt-8">
      <a
        href="https://github.com/jespersjostrom"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Github className="w-5 h-5" />
      </a>
      <a
        href="https://linkedin.com/in/jespersjostrom"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        onClick={() => navigator.clipboard.writeText('contact@jespersjostrom.se')}
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Mail className="w-5 h-5" />
      </button>
    </div>
  )
}