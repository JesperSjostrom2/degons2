import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import CursorTrail from '@/components/cursor-trail'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CursorTrail />
      <Navbar />
      <Hero />
      
      {/* Placeholder sections for future development */}
      <section id="work" className="min-h-screen flex items-center justify-center bg-background/50">
        <h2 className="text-4xl font-bold text-muted-foreground">Featured Work Section</h2>
      </section>
      
      <section id="tech" className="min-h-screen flex items-center justify-center bg-background">
        <h2 className="text-4xl font-bold text-muted-foreground">Tech Stack Section</h2>
      </section>
      
      <section id="education" className="min-h-screen flex items-center justify-center bg-background/50">
        <h2 className="text-4xl font-bold text-muted-foreground">Education Section</h2>
      </section>
      
      <section id="contact" className="min-h-screen flex items-center justify-center bg-background">
        <h2 className="text-4xl font-bold text-muted-foreground">Contact Section</h2>
      </section>
    </main>
  )
}
