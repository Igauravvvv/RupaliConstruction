import { business, localFaqs } from "./local-seo.js";

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"\']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "\'": "&#039;" }[char]!));
}

export function homeHtml(): string {
  return `
        <main class="seo-prerender-container" style="padding:2rem;max-width:1000px;margin:auto;font-family:sans-serif;line-height:1.6">
          <h1>Looking for the best builder in Gurgaon?</h1>
          <p>Choose a contractor in Gurgaon with a clear scope, material specifications and a written estimate. Rupali Construction builds homes and turnkey villas across Gurugram &amp; Delhi NCR.</p>
          <h2>Looking for the best builder in Gurugram?</h2>
          <p>Rupali Construction provides home construction, turnkey villas, architecture, renovation and interiors in Gurugram (Gurgaon) and Delhi NCR. Discuss your plot, design and budget with our team at M3M Broadway, Sector 71.</p>
          <h2>Choose the best contractor in Gurugram for your project</h2>
          <p>Compare completed work, material specifications, a clear scope and a written estimate before choosing your contractor. Review our projects and construction standards to see how we approach your home.</p>
          <nav><a href="/services">Construction services</a> | <a href="/projects">View our projects</a> | <a href="/brand-standards">Material standards</a> | <a href="/contact">Contact us</a> | <a href="/building-guide-gurgaon">How to choose your builder</a></nav>
          <h2>Frequently Asked Questions</h2>
          ${localFaqs.map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join("\n")}
          <h2>Visit Rupali Construction</h2>
          <address>${escapeHtml(business.address)}</address>
          <p>Every day, 10:00 AM–7:00 PM. <a href="tel:+919311830088">+91 93118 30088</a> | <a href="mailto:ujjwalt.rg@rupalihomes.com">ujjwalt.rg@rupalihomes.com</a></p>
          <p><a href="${business.mapsUrl}">Rupali Construction on Google Maps</a> | <a href="${business.directionsUrl}">Get directions</a></p>
        </main>
      `;
}
