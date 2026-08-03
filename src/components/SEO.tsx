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
  image = "https://rupaliconstruction.com/logo-main.webp",
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
      "logo": "https://rupaliconstruction.com/logo-main.webp",
      "image": "https://rupaliconstruction.com/logo-main.webp",
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
