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
    title: "E-commerce Platform",
    description: "A comprehensive full-stack e-commerce solution featuring modern UI/UX design, secure payment processing with Stripe integration, and a robust admin dashboard. Built with scalability and performance in mind to handle high traffic volumes.",
    bulletPoints: [
      "Integrated Stripe payments with secure webhook handling",
      "Real-time inventory management and order tracking",
      "Advanced product filtering with search functionality",
      "Mobile-responsive design with PWA capabilities"
    ],
    skills: ["React", "Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS", "Prisma"],
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    year: "2024",
    duration: "3 months",
    image: "/assets/projects/kerma.png"
  },
  {
    id: 2,
    title: "SaaS Analytics Dashboard",
    description: "Enterprise-level analytics platform providing comprehensive data visualization, custom reporting capabilities, and real-time collaboration features. Designed to handle complex datasets with interactive charts and team-based workflows.",
    bulletPoints: [
      "Interactive data visualization with D3.js and Chart.js",
      "Real-time data streaming using WebSocket connections",
      "Custom report builder with drag-and-drop interface",
      "Role-based access control and team collaboration"
    ],
    skills: ["TypeScript", "React", "D3.js", "Node.js", "Socket.io", "MongoDB", "Redis"],
    backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    year: "2024",
    duration: "4 months",
    image: "/assets/projects/analytics-dashboard.jpg"
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
  'Svelte': 'svelte/svelte-original'
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
    <section id="work" ref={sectionRef} className="bg-background/50 py-20">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Featured Work</h2>
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
                <div className="relative">
                  {/* Laptop Screen - Static Frame */}
                  <div 
                    className="w-4/5 h-96 rounded-2xl relative overflow-hidden mx-auto"
                    style={{ 
                      background: project.backgroundColor,
                      boxShadow: `
                        0 0 0 3px #1f2937,
                        0 0 0 6px #374151,
                        0 0 0 8px #4b5563,
                        0 25px 50px rgba(0, 0, 0, 0.4),
                        inset 0 2px 4px rgba(255, 255, 255, 0.3),
                        inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                        inset 2px 2px 8px rgba(255, 255, 255, 0.15),
                        inset -2px -2px 8px rgba(0, 0, 0, 0.15)
                      `
                    }}
                  >
                    {/* Top section with project title (30% height) */}
                    <div className="absolute top-0 left-0 right-0 h-[30%] flex items-center justify-center z-20 p-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {project.title}
                        </h3>
                        <p className="text-lg text-white/80 drop-shadow-md">
                          {project.year}
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom section with project image (70% height, touching bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 h-[70%] px-8 pb-0 pt-4 overflow-hidden">
                      <div 
                        className="w-full h-[110%] rounded-t-lg overflow-hidden cursor-pointer relative transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-2"
                        style={{
                          transformOrigin: 'center 40%',
                          boxShadow: `
                            0 0 15px rgba(218, 197, 167, 0.4),
                            0 0 30px rgba(218, 197, 167, 0.2),
                            0 5px 15px rgba(0, 0, 0, 0.3)
                          `
                        }}
                      >
                        <img 
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: 'brightness(1) saturate(1) contrast(1)',
                            transition: 'filter 0.3s ease-in-out'
                          }}
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center rounded-t-lg">
                                  <span class="text-white/60 text-sm">Project Image</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                  </div>

                  {/* Laptop Base */}
                  <div 
                    className="w-5/6 h-6 mx-auto mt-2 rounded-b-2xl"
                    style={{
                      background: 'linear-gradient(145deg, #374151, #1f2937)',
                      boxShadow: `
                        0 0 0 2px #4b5563,
                        0 8px 16px rgba(0, 0, 0, 0.3),
                        inset 0 1px 2px rgba(255, 255, 255, 0.2),
                        inset 0 -1px 2px rgba(0, 0, 0, 0.3)
                      `
                    }}
                  />

                  {/* Laptop Notch/Camera */}
                  <div 
                    className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"
                    style={{
                      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
                    }}
                  />
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