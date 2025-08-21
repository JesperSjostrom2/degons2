import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import EmailContact from '@/components/email-contact'
import CVButton from '@/components/cv-button'
import SocialLinks from '@/components/social-links'
import GradientText from '@/components/GradientText'
import CustomCursor from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SmoothScroll />
      <CustomCursor />
      <Navbar />
      <EmailContact />
      <CVButton />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center bg-background py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center max-w-6xl w-full">
              {/* Left Content */}
              <div className="lg:col-span-3 lg:col-start-1 space-y-8">
                <div className="text-left ml-8">
                  <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    MORE ABOUT ME
                  </p>
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)'}}>
                      I'm Jesper, a<br />
                      creative <span className="inline-block" style={{textShadow: 'none'}}><GradientText className="italic" style={{fontFamily: 'cursive'}}>developer</GradientText></span>
                    </h2>
                  </div>
                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                    <p>
                      I'm Jesper Sjöström, a proactive full-stack developer passionate 
                      about creating dynamic web experiences. From frontend to 
                      backend, I thrive on solving complex problems with clean, 
                      efficient code. My expertise spans React, Next.js, and Node.js, 
                      and I'm always eager to learn more.
                    </p>
                    <p>
                      When I'm not immersed in work, I'm exploring new ideas and 
                      staying curious. Life's about balance, and I love embracing 
                      every part of it.
                    </p>
                    <p className="font-medium text-white">
                      I believe in waking up each day eager to make a difference!
                    </p>
                  </div>
                  
                  {/* Social Links */}
                  <SocialLinks />
                </div>
              </div>
              
              {/* Right Profile Section */}
              <div className="lg:col-span-2 flex justify-center items-center">
                <div className="relative w-full max-w-sm">
                  {/* Profile Picture with outline behind */}
                  <div className="relative mb-16 flex justify-start group">
                    {/* Animated outline box behind picture - sticking out right */}
                    <div className="absolute top-6 left-18 w-72 h-72 border-2 border-accent/60 rounded-3xl z-0 animate-pulse transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:translate-y-2"></div>
                    
                    {/* Main Profile Picture */}
                    <div className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent via-accent/95 to-accent/90 z-10 transition-transform duration-300 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 flex items-center justify-center">
                        <span className="text-8xl font-bold text-white">JS</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Information Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-card/30 backdrop-blur-sm border border-accent/20 rounded-xl p-4 text-center relative" style={{boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.1)'}}>
                      <div className="text-2xl font-bold text-white">25</div>
                      <div className="text-xs text-muted-foreground font-medium">AGE</div>
                    </div>
                    <div className="bg-card/30 backdrop-blur-sm border border-accent/20 rounded-xl p-4 text-center relative" style={{boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.1)'}}>
                      <div className="text-2xl font-bold text-white">4+</div>
                      <div className="text-xs text-muted-foreground font-medium">YEARS</div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="bg-card/30 backdrop-blur-sm border border-accent/20 rounded-xl p-5 text-center relative" style={{boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.1)'}}>
                    <div className="text-xl font-bold text-white">Stockholm & Helsinki</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">LOCATION</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
