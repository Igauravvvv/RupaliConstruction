import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import { trpc } from "@/providers/trpc";
import { servicesData } from "@/data/servicesData";
import { fallbackPosts } from "../../shared/blog-content";
import { fallbackProjects } from "../../shared/project-content";

export default function SitemapPage() {
  const { data: projectData } = trpc.project.list.useQuery({ limit: 100 });
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 100 });
  const projects = projectData?.items?.length ? projectData.items : fallbackProjects;
  const posts = blogData?.items?.length ? blogData.items : fallbackPosts;
  const groups = [
    { heading: "Company", links: [
      { path: "/", name: "Home" }, { path: "/services", name: "Construction services" },
      { path: "/projects", name: "Projects" }, { path: "/leadership", name: "Leadership" },
      { path: "/brand-standards", name: "Material standards" }, { path: "/contact", name: "Contact and Google Maps" },
    ] },
    { heading: "Services", links: servicesData.map(service => ({ path: `/services/${service.slug}`, name: service.title })) },
    { heading: "Homeowner guides", links: [
      { path: "/building-guide-gurgaon", name: "Choosing a builder and contractor in Gurgaon" },
      { path: "/blog", name: "All construction articles" },
      ...posts.map(post => ({ path: `/blog/${post.slug}`, name: post.title })),
    ] },
    { heading: "Project portfolio", links: projects.map(project => ({ path: `/projects/${project.slug}`, name: project.name })) },
  ];
  return <div className="min-h-screen bg-[var(--rc-white)]">
    <SEO title="Sitemap | Rupali Construction" description="Find construction services, projects, building guides and contact details for Rupali Construction in Gurgaon." url="/sitemap" />
    <Navbar />
    <main className="container-rc pt-32 pb-16">
      <h1 className="text-display-2 text-[var(--rc-dark)] mb-4">Rupali Construction sitemap</h1>
      <p className="text-[var(--rc-muted)] mb-10">Explore our construction services, work and guides for building in Gurgaon (Gurugram).</p>
      <div className="grid md:grid-cols-2 gap-10">
        {groups.map(group => <section key={group.heading}>
          <h2 className="text-2xl font-semibold text-[var(--rc-dark)] mb-4">{group.heading}</h2>
          <ul className="space-y-3">{group.links.map(link => <li key={link.path}>
            <Link className="text-[var(--rc-blue)] underline underline-offset-4" to={link.path}>{link.name}</Link>
          </li>)}</ul>
        </section>)}
      </div>
    </main>
    <Footer />
  </div>;
}
