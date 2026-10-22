export const homeSeo = {
  title: "Best Builder & Contractor in Gurgaon | Rupali Construction",
  description: "Looking for the best builder in Gurgaon? Explore Rupali Construction for home building, turnkey contracting, architecture and interiors in Gurugram.",
  keywords: "best builder in gurugram, best contractor in gurugram, best builder in gurgaon, best contractor in gurgaon, construction company in gurugram, home construction gurgaon, turnkey construction gurugram, residential construction company gurgaon, independent house construction gurugram, villa construction gurgaon, building contractor gurgaon, civil contractor gurugram, commercial construction gurgaon, home renovation gurugram, interior design gurgaon, architectural design gurugram, structural engineering gurgaon, house construction cost gurgaon, construction cost calculator gurugram, Rupali Construction",
};

// Coordinates and business identity from the owner's Google Maps listing.
export const business = {
  name: "Rupali Construction",
  url: "https://rupaliconstruction.com",
  address: "5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122001",
  mapsUrl: "https://www.google.com/maps?cid=11701277791317730988",
  mapsEmbedUrl: "https://www.google.com/maps?cid=11701277791317730988&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=28.4014816,77.0190575",
  latitude: 28.4014816,
  longitude: 77.0190575,
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${business.url}/#organization`,
  name: business.name,
  alternateName: "Rupali Homes",
  url: business.url,
  logo: `${business.url}/logo-icon.png`,
  image: `${business.url}/logo-main.webp`,
  description: "Home construction, turnkey villas, architecture, renovation and interiors in Gurugram (Gurgaon) and Delhi NCR.",
  telephone: "+919311830088",
  email: "ujjwalt.rg@rupalihomes.com",
  hasMap: business.mapsUrl,
  sameAs: [business.mapsUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "5th floor, M3M Broadway, Sector 71",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.latitude, longitude: business.longitude },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "10:00",
    closes: "19:00",
  },
  areaServed: [
    { "@type": "City", name: "Gurugram", alternateName: "Gurgaon" },
    { "@type": "Place", name: "Delhi NCR" },
  ],
};

export const localFaqs = [
  {
    question: "How should I compare builders for my home?",
    answer: "Compare completed projects, written specifications, material brands, a detailed cost estimate and the proposed schedule. Ask how changes and site updates are handled. Explore Rupali Construction's projects and brand standards, then discuss your plot and requirements with our team.",
  },
  {
    question: "What should I agree with my contractor before starting?",
    answer: "Ask for a clear scope covering civil work, materials, architecture, interiors and exclusions. Agree on milestones, payment terms, responsibilities and handover requirements in writing. Rupali Construction offers residential construction and turnkey services in Gurugram (Gurgaon).",
  },
  {
    question: "Where is Rupali Construction's office and how can I visit?",
    answer: `Our office is at ${business.address}. Call +91 93118 30088 to arrange a visit, every day, 10:00 AM to 7:00 PM. Use the Google Maps link on our contact page for directions.`,
  },
];

export const localFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: localFaqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};
