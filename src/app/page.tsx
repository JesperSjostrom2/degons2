import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import CursorTrail from '@/components/cursor-trail'
import EmailContact from '@/components/email-contact'
import CVButton from '@/components/cv-button'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CursorTrail />
      <Navbar />
      <EmailContact />
      <CVButton />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-background py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">About Me</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get to know more about my journey, passion for frontend development, and what drives me to create exceptional digital experiences.
          </p>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="min-h-screen flex items-center justify-center bg-background/50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Experience</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional journey and career highlights showcasing growth and expertise in frontend development.
          </p>
        </div>
      </section>
      
      {/* Work Section */}
      <section id="work" className="min-h-screen flex items-center justify-center bg-background py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Featured Work</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of projects that demonstrate technical skills and creative problem-solving abilities.
          </p>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="min-h-screen flex items-center justify-center bg-background/50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Skills</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Technical expertise and proficiency across various technologies, frameworks, and development practices.
          </p>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center bg-background py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Contact</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch to discuss opportunities, collaborations, or just to say hello.
          </p>
        </div>
      </section>
      
    </main>
  )
}
