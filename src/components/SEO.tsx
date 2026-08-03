import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  type?: string;
  image?: string;
  url?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
}

export default function SEO({ 
  title = "Rupali Construction | Crafting Architecture into Reality", 
  description = "Rupali Construction is a premium Gurgaon-based company specializing in residential construction, luxury villas, real estate resale, and architectural design.", 
  keywords = "construction, Gurgaon, residential, commercial, villas, resell, real estate, architecture, turnkey interior, luxury home contractor",
  type = "website",
  image = "https://rupaliconstruction.com/logo-main.png",
  url = "https://rupaliconstruction.com",
  schema,
  noindex = false
}: SEOProps) {
  const absoluteUrl = url.startsWith("http") ? url : `https://rupaliconstruction.com${url.startsWith("/") ? "" : "/"}${url}`;
  const absoluteImage = image.startsWith("http") ? image : `https://rupaliconstruction.com${image.startsWith("/") ? "" : "/"}${image}`;

  // Default WebSite & Organization schema for Google Search Console & Knowledge Graph Listings
  const defaultSchema = [
    {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": "Rupali Construction",
      "alternateName": "Rupali Homes",
      "url": "https://rupaliconstruction.com",
      "logo": "https://rupaliconstruction.com/logo-icon.png",
      "image": "https://rupaliconstruction.com/logo-main.png",
      "description": description,
      "telephone": "+919311830088",
      "email": "ujjwalt.rg@rupalihomes.com",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "5th floor, M3M Broadway, Sector 71",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122004",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.3971,
        "longitude": 77.0370
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "19:00"
      },
      "areaServed": {
        "@type": "City",
        "name": "Gurugram"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Rupali Construction",
      "url": "https://rupaliconstruction.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://rupaliconstruction.com/projects?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Rupali Construction Main Navigation & Sitelinks",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Ongoing & Luxury Villa Projects",
          "description": "Explore our exclusive portfolio of delivered luxury residential villas, custom estates, and architectural landmarks in Gurugram.",
          "url": "https://rupaliconstruction.com/projects"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Turnkey Construction & Architectural Services",
          "description": "End-to-end luxury residential construction, turnkey interior design, structural engineering, and villa renovation in Delhi NCR.",
          "url": "https://rupaliconstruction.com/services"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Our Leadership & Architects",
          "description": "Meet our licensed structural engineers and architectural leadership team behind Gurgaon's luxury homes.",
          "url": "https://rupaliconstruction.com/leadership"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Quality Material & Brand Standards",
          "description": "Discover our strict quality benchmarks, premium brands, and lab-tested building materials used in our villa construction.",
          "url": "https://rupaliconstruction.com/brand-standards"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Construction Cost Guides & Blog",
          "description": "Read our latest insights on home building costs, Vastu design tips, material selection, and construction guides in Gurgaon.",
          "url": "https://rupaliconstruction.com/blog"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Contact Us & Free Online Estimate",
          "description": "Get in touch with Rupali Construction at M3M Broadway, Gurgaon for instant cost estimates, floor plans, and architectural consulting.",
          "url": "https://rupaliconstruction.com/contact"
        }
      ]
    }
  ];

  const finalSchema = schema ? (Array.isArray(schema) ? schema : [schema]) : defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Robot Instructions */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={absoluteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteImage} />

      {/* Structured Data (JSON-LD) for Google Search Listings & Rich Snippets */}
      {!noindex && finalSchema.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
