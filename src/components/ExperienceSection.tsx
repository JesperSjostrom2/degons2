'use client'

import { useState, useRef, useEffect } from 'react'
// Animations removed for instant content updates

interface Project {
  id: number
  title: string
  description: string
  bulletPoints: string[]
  skills: string[]
  backgroundColor: string
  year: string
  duration: string
  image: string
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "ANDCREATIVE",
    description: "A modern, premium website built for a creative agency. 'VISUALS WITH MEANING - We turn your vision into timeless visuals—photo and film.' The platform focuses on high-end visual storytelling and showcases their photography and videography portfolio.",
    bulletPoints: [
      "Designed and developed a sleek, dark-themed UI that puts visual content first",
      "Implemented smooth, cinematic interactions and scroll animations",
      "Optimized media loading for high-resolution photo and video assets",
      "Created a responsive layout that maintains the premium feel across all devices"
    ],
    skills: ["Next.js", "Tailwind CSS", "Framer Motion", "UI/UX", "Web Design"],
    backgroundColor: "linear-gradient(135deg, #111111 0%, #000000 100%)",
    year: "2026",
    duration: "3 months",
    image: "/assets/projects/andcreative.png"
  },
  {
    id: 2,
    title: "Café & Bistro Kerma",
    description: "At Café & Bistro Kerma, I was an all-around worker responsible for a wide range of tasks including inventory management, serving food, cooking, and working at the bar. I designed and developed the website, creating a user-friendly platform with an online menu and reservation system.",
    bulletPoints: [
      "Designed and developed the complete website with online menu and reservation system",
      "Created the logotype, designing an easy and simple logo to recognize",
      "Maintained close customer contact to ensure satisfaction with branding and web presence",
      "Incorporated customer feedback to refine brand identity and online presence"
    ],
    skills: ["Web Design", "Logo Design", "Brand Identity", "UI/UX", "HTML/CSS", "JavaScript"],
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    year: "2024",
    duration: "6 months",
    image: "/assets/projects/kerma.png"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Modern, interactive portfolio website showcasing creative web development skills. Features smooth animations, dark mode support, and optimized performance with custom components and innovative layout designs.",
    bulletPoints: [
      "Smooth scroll animations with Framer Motion",
      "Custom interactive components and visual effects",
      "SEO optimized with perfect Lighthouse performance scores",
      "Fully responsive design across all device types"
    ],
    skills: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "GSAP", "Three.js"],
    backgroundColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    year: "2023",
    duration: "2 months",
    image: "/assets/projects/ogportfolio.png"
  }
]


interface ProjectInfoProps {
  project: Project
}

// Skill to devicon mapping
const skillLogos: { [key: string]: string } = {
  'React': 'react/react-original',
  'Next.js': 'nextjs/nextjs-original',
  'TypeScript': 'typescript/typescript-original',
  'PostgreSQL': 'postgresql/postgresql-original',
  'Stripe': 'javascript/javascript-original', // Fallback for Stripe
  'Tailwind CSS': 'tailwindcss/tailwindcss-plain',
  'Prisma': 'postgresql/postgresql-original', // Fallback for Prisma
  'D3.js': 'd3js/d3js-original',
  'Node.js': 'nodejs/nodejs-original',
  'Socket.io': 'socketio/socketio-original',
  'MongoDB': 'mongodb/mongodb-original',
  'Redis': 'redis/redis-original',
  'Framer Motion': 'react/react-original', // Fallback for Framer Motion
  'GSAP': 'javascript/javascript-original', // Fallback for GSAP
  'Three.js': 'threejs/threejs-original',
  'JavaScript': 'javascript/javascript-original',
  'Python': 'python/python-original',
  'Vue.js': 'vuejs/vuejs-original',
  'Angular': 'angularjs/angularjs-original',
  'Svelte': 'svelte/svelte-original',
  'Web Design': 'figma/figma-original',
  'Logo Design': 'illustrator/illustrator-plain',
  'Brand Identity': 'photoshop/photoshop-plain',
  'UI/UX': 'figma/figma-original',
  'HTML/CSS': 'html5/html5-original'
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  return (
    <div
      key={project.id}
      className="space-y-4"
    >
        {/* Project Header */}
        <div>
          <div className="flex items-center gap-6 mb-2">
            <div className="w-6 h-1 bg-accent rounded-full -ml-10"></div>
            <h3 className="text-2xl font-bold text-white">
              {project.title}
            </h3>
            <span className="text-sm px-3 py-1 rounded-full border border-accent/40 bg-accent/20 text-accent">
              {project.year}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-lg">
          {project.description}
        </p>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold mb-3 text-base text-accent">
            Key Features
          </h4>
          <ul className="space-y-2">
            {project.bulletPoints.map((point, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 text-white"
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-accent" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills with Real Logos */}
        <div>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 transition-all duration-300 hover:bg-accent/20 hover:scale-105 group"
              >
                <img 
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillLogos[skill] || 'javascript/javascript-original'}.svg`}
                  alt={skill}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm text-white/90 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

const ExperienceSection: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState(projectsData[0].id)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0.3
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const projectId = parseInt(entry.target.getAttribute('data-project-id') || '1')
          setActiveProjectId(projectId)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all project images
    const projectImages = document.querySelectorAll('[data-project-id]')
    projectImages.forEach((image) => observer.observe(image))

    return () => observer.disconnect()
  }, [])

  const activeProject = projectsData.find(p => p.id === activeProjectId) || projectsData[0]

  return (
    <section id="projects" ref={sectionRef} className="bg-background/50 py-20">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Featured Projects</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A collection of projects that demonstrate technical skills and creative problem-solving abilities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex gap-12">
          {/* Left Side - Project Images (60%) */}
          <div className="w-3/5">
            {projectsData.map((project) => (
              <div 
                key={project.id}
                className="mb-24"
                data-project-id={project.id}
              >
                <div className="relative mx-auto w-4/5">
                  <div className="relative h-96 rounded-[24px] border border-white/10 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black p-[10px] pb-3">
                    <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/15" />
                    <div className="relative h-full overflow-hidden rounded-[16px] border border-black bg-black cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.015]">
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                                <span class="text-white/60 text-sm">Project Image</span>
                              </div>
                            `;
                          }
                        }}
                      />
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <div className="mx-auto h-2 w-[86%] rounded-b-sm bg-gradient-to-b from-zinc-700 to-zinc-900" />
                  <div className="relative mx-auto h-8 w-[106%] -translate-x-[3%] rounded-b-[26px] border-t border-white/15 bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-900">
                    <div className="absolute left-1/2 top-0 h-2.5 w-28 -translate-x-1/2 rounded-b-xl bg-black/30" />
                    <div className="absolute bottom-1.5 left-1/2 h-2 w-40 -translate-x-1/2 rounded-xl border border-white/10 bg-black/15" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Sticky Project Info (40%) */}
          <div className="w-2/5">
            <div className="sticky top-64 h-fit">
              <ProjectInfo key={activeProjectId} project={activeProject} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
