'use client'

import { Github, Linkedin, Mail } from 'lucide-react'

export default function SocialLinks() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex gap-4 mt-8">
      <a
        href="https://github.com/jespersjostrom2"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Github className="w-5 h-5" />
      </a>
      <a
        href="https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        type="button"
        onClick={scrollToContact}
        className="text-muted-foreground hover:text-accent transition-colors duration-200"
      >
        <Mail className="w-5 h-5" />
      </button>
    </div>
  )
}
