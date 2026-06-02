'use client'

import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { SocialIconLink } from '@/components/social-icon-link'
import { siteSocialLinks } from '@/lib/site-config'

const socialIcons = {
  GitHub: {
    icon: <FiGithub className="h-5 w-5" />,
    hoverIcon: <FaGithub className="h-5 w-5" />,
  },
  LinkedIn: {
    icon: <FiLinkedin className="h-5 w-5" />,
    hoverIcon: <FaLinkedin className="h-5 w-5" />,
  },
  Email: {
    icon: <FiMail className="h-5 w-5" />,
    hoverIcon: <FaEnvelope className="h-5 w-5" />,
  },
}

export const portfolioSocialLinks = siteSocialLinks.map((link) => ({
  ...link,
  ...socialIcons[link.label as keyof typeof socialIcons],
}))

export default function SocialLinks() {
  return (
    <div className="mt-8 flex gap-2">
      {portfolioSocialLinks.map((link) => (
        <SocialIconLink key={link.label} {...link} />
      ))}
    </div>
  )
}
