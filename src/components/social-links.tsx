'use client'

import { Github, Linkedin, Mail } from 'lucide-react'

export default function SocialLinks() {
  const socialLinkClass = 'group relative inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45'
  const outlineIconClass = 'h-5 w-5 transition-all duration-200 group-hover:scale-75 group-hover:opacity-0'
  const fillIconClass = 'absolute h-5 w-5 scale-75 fill-current opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100'

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mt-8 flex gap-2">
      <a
        href="https://github.com/jespersjostrom2"
        target="_blank"
        rel="noopener noreferrer"
        className={socialLinkClass}
      >
        <Github className={outlineIconClass} />
        <Github className={fillIconClass} />
      </a>
      <a
        href="https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/"
        target="_blank"
        rel="noopener noreferrer"
        className={socialLinkClass}
      >
        <Linkedin className={outlineIconClass} />
        <Linkedin className={fillIconClass} />
      </a>
      <button
        type="button"
        onClick={scrollToContact}
        className={socialLinkClass}
      >
        <Mail className={outlineIconClass} />
        <Mail className={fillIconClass} />
      </button>
    </div>
  )
}
