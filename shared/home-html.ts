import { constructionConcerns } from "./construction-concerns.js";
import { business, localFaqs } from "./local-seo.js";

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"\']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "\'": "&#039;" }[char]!));
}

export function homeHtml(): string {
  return `
        <main class="seo-prerender-container" style="padding:2rem;max-width:1000px;margin:auto;font-family:sans-serif;line-height:1.6">
          <h1>Your home. Thoughtfully built.</h1>
          <p>Home construction, turnkey villas and interiors in Gurgaon and Delhi NCR, with clear planning from your first idea to the final handover.</p>
          <nav><a href="/services">Construction services</a> | <a href="/projects">View our projects</a> | <a href="/brand-standards">Material standards</a> | <a href="/contact">Contact us</a> | <a href="/building-guide-gurgaon">How to choose your builder</a></nav>
          <section><h2>Common concerns. Practical solutions.</h2>
          ${constructionConcerns.map(item => `<article><p>${escapeHtml(item.concern)}</p><h3>${escapeHtml(item.approach)}</h3><p>${escapeHtml(item.detail)}</p></article>`).join("")}</section>
          <section><h2>What could your home cost?</h2><p>Explore your construction budget with our interactive calculator. Choose your project details and compare material packages.</p><a href="/#estimate">Calculate your estimate</a></section>
          <h2>Frequently Asked Questions</h2>
          ${localFaqs.map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join("\n")}
          <h2>Visit Rupali Construction</h2>
          <address>${escapeHtml(business.address)}</address>
          <p>Every day, 10:00 AM–7:00 PM. <a href="tel:+919311830088">+91 93118 30088</a> | <a href="mailto:ujjwalt.rg@rupalihomes.com">ujjwalt.rg@rupalihomes.com</a></p>
          <p><a href="${business.mapsUrl}">Rupali Construction on Google Maps</a> | <a href="${business.directionsUrl}">Get directions</a></p>
        </main>
      `;
}
