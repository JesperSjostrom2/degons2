import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download, Mail, Phone, MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CVPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      {/* Header with back button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 rounded-full w-12 h-12 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* CV Content */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-accent">Jesper</span> Sjöström
          </h1>
          <p className="text-xl text-muted-foreground mb-6">Frontend Developer</p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contact@jespersjostrom.se</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>jespersjostrom.se</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Stockholm, Sweden</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mb-12">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* CV Sections */}
        <div className="space-y-12">
          {/* Experience */}
          <section>
            <h2 className="text-2xl font-bold text-accent mb-6">Experience</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-accent/30 pl-6">
                <h3 className="text-xl font-semibold">Senior Frontend Developer</h3>
                <p className="text-accent mb-2">Company Name • 2023 - Present</p>
                <p className="text-muted-foreground">
                  Leading frontend development projects using React, TypeScript, and modern web technologies. 
                  Collaborating with cross-functional teams to deliver high-quality user experiences.
                </p>
              </div>
              
              <div className="border-l-2 border-accent/30 pl-6">
                <h3 className="text-xl font-semibold">Frontend Developer</h3>
                <p className="text-accent mb-2">Previous Company • 2021 - 2023</p>
                <p className="text-muted-foreground">
                  Developed and maintained web applications, implemented responsive designs, 
                  and optimized performance for better user experience.
                </p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold text-accent mb-6">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Frontend Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Tools & Others</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Figma', 'Webpack', 'Node.js', 'REST APIs', 'GraphQL'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-accent mb-6">Education</h2>
            <div className="border-l-2 border-accent/30 pl-6">
              <h3 className="text-xl font-semibold">Computer Science Degree</h3>
              <p className="text-accent mb-2">University Name • 2018 - 2021</p>
              <p className="text-muted-foreground">
                Bachelor's degree in Computer Science with focus on web development and software engineering.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}