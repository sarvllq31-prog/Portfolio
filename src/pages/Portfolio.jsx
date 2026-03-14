import GlobalBackground from '../components/layout/GlobalBackground'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/portfolio/Hero'
import About from '../components/portfolio/About'
import Skills from '../components/portfolio/Skills'
import Certificates from '../components/portfolio/Certificates'
import Projects from '../components/portfolio/Projects'
import Education from '../components/portfolio/Education'
import Contact from '../components/portfolio/Contact'

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <GlobalBackground />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Certificates />
      <Projects />
      <Education />
      <Contact />
    </div>
  )
}
