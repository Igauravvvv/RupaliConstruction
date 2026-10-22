import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import { buildingGuide } from "../../shared/building-guide";

export default function BuildingGuide() {
  return <div className="min-h-screen bg-[var(--rc-white)]">
    <SEO title={buildingGuide.title} description={buildingGuide.description} url={buildingGuide.path} />
    <Navbar />
    <main className="container-rc max-w-4xl pt-32 pb-16">
      <nav className="mb-8 text-sm text-[var(--rc-muted)]"><Link to="/">Home</Link> / Building guide</nav>
      <h1 className="text-display-2 text-[var(--rc-dark)] mb-6">{buildingGuide.heading}</h1>
      <p className="text-lg text-[var(--rc-muted)] leading-relaxed mb-10">{buildingGuide.intro}</p>
      {buildingGuide.sections.map(section => <section key={section.heading} className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--rc-dark)] mb-3">{section.heading}</h2>
        <p className="text-[var(--rc-muted)] leading-relaxed">{section.text}</p>
      </section>)}
      <nav className="flex flex-wrap gap-5 text-[var(--rc-blue)] underline underline-offset-4">
        <Link to="/services/residential-construction">Home construction services</Link>
        <Link to="/projects">Project portfolio</Link>
        <Link to="/brand-standards">Material standards</Link>
        <Link to="/contact">Request a construction consultation</Link>
      </nav>
    </main>
    <Footer />
  </div>;
}
