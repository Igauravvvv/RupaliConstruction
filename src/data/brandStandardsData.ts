import {
  Landmark,
  Zap,
  Paintbrush,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── INTERFACES ─────────────────────────────────────────

export const brandDomains: Record<string, string> = {
  "UltraTech Cement": "ultratechcement.com",
  "UltraTech": "ultratechcement.com",
  "Ambuja Cement": "ambujacement.com",
  "ACC Cement": "acclimited.com",
  "Shree Cement": "shreecement.com",
  "Tata Tiscon": "tatatiscon.co.in",
  "Tata Steel": "tatasteel.com",
  "JSW Steel": "jsw.in",
  "Dr. Fixit": "drfixit.co.in",
  "Havells": "havells.com",
  "Schneider Electric": "se.com",
  "Legrand": "legrand.co.in",
  "Finolex Pipes": "finolexpipes.com",
  "Astral": "astralpipes.com",
  "Jaquar": "jaquar.com",
  "Kohler": "kohler.co.in",
  "Cera": "cera-india.com",
  "Century Ply": "centuryply.com",
  "Fenesta": "fenesta.com",
  "Kajaria": "kajariaceramics.com",
  "Asian Paints": "asianpaints.com",
  "Syska": "syska.co.in",
  "Godrej Locks": "godrej.com",
  "Hafele": "hafeleindia.com",
  "Saint-Gobain Gyproc": "gyproc.in",
  "Saint-Gobain": "saint-gobain.co.in",
  "Aludecor": "aludecor.com",
  "Daikin": "daikinindia.com",
  "Philips": "lighting.philips.co.in",
  "D'Decor": "ddecor.com",
  "Pidilite (Dr. Fixit)": "pidilite.com"
};

export interface Product {
  name: string;
  image: string;
  description?: string;
  features: string[];
  grade?: string;
  type?: string;
  standard?: string;
  strength?: string;
  applications?: string[];
  technicalSpecs?: Record<string, string>;
  benefits?: string[];
  installationNotes?: string;
  maintenance?: string;
  expectedLifespan?: string;
  warranty?: string;
  certifications?: string[];
  brochureUrl?: string;
  websiteUrl?: string;
}

export interface Brand {
  name: string;
  image?: string;
  description: string;
  confirmed: boolean;
  keyBenefits?: string[];
  products?: Product[];
  country?: string;
  yearsInBusiness?: number;
  whyWeChose?: string[];
  certifications?: string[];
  website?: string;
}

export interface SubCategory {
  name: string;
  brands: Brand[];
  description?: string;
  image?: string;
  whatIsIt?: string;
  whyWeUseIt?: string[];
  whereUsed?: string[];
  benefits?: string[];
  qualityChecks?: string[];
  didYouKnow?: string;
  constructionTip?: string;
  qualityStandard?: string;
}

export interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  image: string;
  subcategories: SubCategory[];
  description: string;
  tagline?: string;
  materialCount?: number;
  brandCount?: number;
}

// ─── CATEGORIES ─────────────────────────────────────────

export const categories: Category[] = [
  // ───────────────────── STRUCTURAL ─────────────────────
  {
    name: "Structural",
    icon: Landmark,
    color: "#0A1D3A",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    description: "Builds the strength and foundation of your home.",
    tagline: "The backbone of every durable structure",
    materialCount: 6,
    brandCount: 12,
    subcategories: [
      {
        name: "Cement",
        description: "Used for foundations, columns, slabs and structural concrete.",
        image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Cement is the primary binding material used for producing concrete and mortar. It binds aggregates together to create strong structural components such as foundations, columns, beams and slabs. When mixed with water, it undergoes hydration — a chemical process that causes it to harden and gain compressive strength over time.",
        whyWeUseIt: [
          "Provides exceptional compressive strength",
          "Ensures long-term structural durability",
          "Creates strong bonding between aggregates",
          "Improves overall building life",
          "Delivers consistent construction quality",
          "Meets Indian quality standards (BIS)"
        ],
        whereUsed: ["Foundation", "Columns", "Beams", "Slabs", "Walls", "Roof", "Plastering"],
        benefits: ["High Strength", "Crack Resistant", "Long Lasting", "Moisture Resistant", "Industry Certified"],
        qualityChecks: ["IS Certification", "Manufacturing Date", "Batch Consistency", "Supplier Verification", "Fineness Test", "Setting Time Test"],
        didYouKnow: "PPC Cement generates less heat during hydration, making it ideal for large concrete structures like raft foundations.",
        constructionTip: "Store cement bags at least 150 mm above the floor on a raised platform to prevent moisture absorption. Use within 90 days of manufacturing.",
        qualityStandard: "All cement must comply with IS 269 (OPC), IS 1489 (PPC), or IS 455 (PSC) standards.",
        brands: [
          {
            name: "UltraTech Cement",
            image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=400&q=80",
            description: "India's largest cement manufacturer trusted across premium residential and commercial projects. Known for consistent quality and advanced manufacturing processes.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 40,
            keyBenefits: ["High Strength", "Durability", "Sustainability"],
            whyWeChose: ["Consistent quality across batches", "Excellent compressive strength", "Nationwide availability", "Proven durability in harsh conditions", "Trusted industry leader"],
            certifications: ["IS 12269", "IS 1489", "ISO 9001", "ISO 14001"],
            website: "https://www.ultratechcement.com",
            products: [
              {
                name: "UltraTech OPC 53 Grade",
                image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=400&q=80",
                description: "High-strength Ordinary Portland Cement ideal for all structural applications. Delivers superior early strength and long-term durability for RCC work.",
                features: [
                  "53 Grade Ordinary Portland Cement",
                  "High early strength development",
                  "Ideal for RMC, precast & general construction",
                  "Consistent quality and performance",
                  "IS 12269 Certified"
                ],
                grade: "53 Grade",
                type: "OPC",
                standard: "IS 12269",
                strength: "High Early Strength",
                applications: ["RCC Structures", "Precast Elements", "Ready Mix Concrete", "High-rise Buildings"],
                technicalSpecs: {
                  "Compressive Strength (28 days)": "≥ 53 MPa",
                  "Fineness": "≥ 225 m²/kg",
                  "Initial Setting Time": "≥ 30 min",
                  "Final Setting Time": "≤ 600 min",
                  "Soundness": "≤ 10 mm"
                },
                benefits: ["Rapid strength gain", "Superior finish quality", "Reduced construction time", "Cost effective for structural work"],
                installationNotes: "Maintain water-cement ratio as per design mix. Ensure proper curing for minimum 7 days.",
                maintenance: "Concrete surfaces should be protected from direct sunlight during initial curing period.",
                expectedLifespan: "100+ years (in properly designed and maintained structures)",
                warranty: "Quality guaranteed as per BIS standards",
                certifications: ["IS 12269", "BIS Certified"],
              },
              {
                name: "UltraTech PPC Cement",
                image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=400&q=80",
                description: "Portland Pozzolana Cement for highly durable structures with excellent resistance to chemical attacks.",
                features: ["Sulphate resistant", "Low heat of hydration", "Excellent surface finish", "Eco-friendly with fly ash content"],
                grade: "PPC",
                type: "PPC",
                standard: "IS 1489",
                strength: "High Long-term Strength",
                applications: ["Mass Concreting", "Plastering", "Marine Structures", "Underground Construction"],
                technicalSpecs: {
                  "Compressive Strength (28 days)": "≥ 33 MPa",
                  "Fly Ash Content": "15-35%",
                  "Fineness": "≥ 300 m²/kg",
                  "Initial Setting Time": "≥ 30 min"
                },
                benefits: ["Lower heat of hydration", "Better workability", "Reduced cracking", "Environmentally friendly"],
                expectedLifespan: "100+ years",
                certifications: ["IS 1489", "BIS Certified"],
              },
              {
                name: "UltraTech PSC Cement",
                image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=400&q=80",
                description: "Portland Slag Cement offering enhanced resistance to chemical attacks, ideal for coastal and industrial areas.",
                features: ["Resists chloride and sulphate attacks", "Ideal for coastal areas", "High long term strength", "Low alkali content"],
                grade: "PSC",
                type: "PSC",
                standard: "IS 455",
                strength: "Durable",
                applications: ["Coastal Structures", "Industrial Flooring", "Sewage Treatment Plants", "Marine Construction"],
                certifications: ["IS 455", "BIS Certified"],
              },
            ]
          },
          {
            name: "Shree Cement",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
            description: "Premium-grade clinker quality delivering exceptional durability. One of India's top cement manufacturers with advanced grinding technology.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 45,
            keyBenefits: ["Consistent Quality", "High Workability", "Weather Proof"],
            whyWeChose: ["Superior clinker quality", "Advanced manufacturing technology", "Excellent finish", "Reliable supply chain"],
            certifications: ["IS 12269", "IS 1489", "ISO 9001"],
            website: "https://www.shreecement.com",
          },
          {
            name: "Birla Cement",
            image: "https://images.unsplash.com/photo-1590246814883-57764bb847f3?auto=format&fit=crop&w=400&q=80",
            description: "A trusted name in Indian construction with decades of proven quality and widespread availability across all regions.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 35,
            keyBenefits: ["Wide Availability", "Consistent Strength", "Trusted Brand"],
            whyWeChose: ["Proven track record", "Consistent batch quality", "Strong distribution network", "Good technical support"],
            certifications: ["IS 12269", "IS 1489", "ISO 9001"],
          },
        ],
      },
      {
        name: "Steel",
        description: "Reinforcement bars and structural steel for RCC construction.",
        image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Steel reinforcement is the backbone of RCC (Reinforced Cement Concrete) construction. TMT (Thermo-Mechanically Treated) bars are used to reinforce concrete, providing tensile strength that concrete alone cannot deliver. Structural steel sections are used for fabrication of beams, columns, trusses, and frames.",
        whyWeUseIt: [
          "Reinforces concrete structures against tension and shear forces",
          "Improves earthquake resistance through ductility",
          "Increases overall structural strength significantly",
          "Reduces cracking in concrete members",
          "Provides long service life with minimal maintenance",
          "Enables construction of large span structures"
        ],
        whereUsed: ["Foundation", "Columns", "Beams", "Slabs", "Staircase", "Roof Truss", "Retaining Walls"],
        benefits: ["High Strength", "Earthquake Resistant", "Corrosion Resistant", "High Bendability", "Weldable", "Long Lasting"],
        qualityChecks: ["IS Certification", "Tensile Strength Test", "Bend Test", "Elongation Test", "Chemical Composition", "Rib Pattern Verification"],
        didYouKnow: "TMT bars undergo a three-stage process — quenching, self-tempering, and atmospheric cooling — that gives them a tough outer surface with a ductile core.",
        constructionTip: "Always check TMT bars for rust before use. Light surface rust is acceptable, but flaking or deep pitting indicates compromised quality.",
        qualityStandard: "All TMT bars must comply with IS 1786 (High Strength Deformed Steel Bars and Wires for Concrete Reinforcement).",
        brands: [
          {
            name: "Tata Steel",
            image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=400&q=80",
            description: "India's most trusted steel brand with over a century of manufacturing excellence. Tata Tiscon TMT bars are the benchmark for quality in construction.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 115,
            keyBenefits: ["Earthquake Resistant", "High Bendability", "Corrosion Resistant"],
            whyWeChose: ["Century-old legacy of quality", "Superior earthquake resistance", "Excellent bendability without cracking", "Pan-India availability", "Rigorous quality testing"],
            certifications: ["IS 1786", "ISO 9001", "BIS Certified"],
            website: "https://www.tatasteel.com",
            products: [
              {
                name: "Tata Tiscon TMT Bars",
                image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=400&q=80",
                description: "Premium TMT rebars with controlled raw material and CRM technology for superior earthquake resistance.",
                features: ["Fe 500D Grade", "Earthquake resistant", "Superior bendability", "Corrosion resistant", "Weldable"],
                grade: "Fe 500D",
                type: "TMT",
                standard: "IS 1786",
                strength: "High Strength",
                applications: ["RCC Columns", "Beams", "Slabs", "Foundation", "High-rise Buildings"],
                technicalSpecs: {
                  "Yield Strength": "≥ 500 MPa",
                  "Ultimate Tensile Strength": "≥ 565 MPa",
                  "Elongation": "≥ 16%",
                  "Carbon Content": "≤ 0.25%"
                },
                benefits: ["Superior earthquake performance", "Easy to work with", "Long structural life", "Consistent quality"],
                expectedLifespan: "75-100 years",
                certifications: ["IS 1786", "BIS Certified"],
              }
            ]
          },
          {
            name: "JSW Steel",
            image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
            description: "India's leading private steel manufacturer with state-of-the-art production facilities and consistent quality output.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 40,
            keyBenefits: ["High Strength", "Ductile", "Uniform Quality"],
            whyWeChose: ["Advanced manufacturing processes", "Consistent mechanical properties", "Wide range of sizes", "Strong quality control"],
            certifications: ["IS 1786", "ISO 9001"],
            website: "https://www.jsw.in",
          },
          {
            name: "SAIL",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
            description: "Steel Authority of India Limited — the nation's largest steel producer with a legacy of reliable structural steel.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 50,
            keyBenefits: ["Government Quality Standards", "Wide Range", "Affordable"],
            whyWeChose: ["National steel producer with strict standards", "Consistent availability", "Proven in mega infrastructure projects"],
            certifications: ["IS 1786", "IS 2062"],
          },
          {
            name: "Jindal Steel",
            description: "Premium quality TMT bars with advanced technology for superior construction performance.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 50,
            keyBenefits: ["High Ductility", "Corrosion Resistant", "Weldable"],
            whyWeChose: ["Advanced Tempcore technology", "Excellent corrosion resistance", "Consistent quality"],
            certifications: ["IS 1786", "BIS Certified"],
          },
          {
            name: "Kamdhenu Steel",
            description: "Trusted TMT bar manufacturer with widespread availability and consistent quality for residential construction.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 25,
            keyBenefits: ["Affordable Quality", "Wide Availability", "Trusted Brand"],
            whyWeChose: ["Good value for money", "Consistent quality", "Strong dealer network"],
            certifications: ["IS 1786"],
          },
        ],
      },
      {
        name: "Bricks",
        description: "High-quality traditional and hollow bricks for strong wall construction.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Bricks are the fundamental masonry units used to build walls and partitions. From traditional red clay bricks to modern hollow electrical bricks, they provide the structural form of the rooms.",
        whyWeUseIt: [
          "Strong and durable wall construction",
          "Excellent thermal insulation properties",
          "Fire resistance for safety",
          "Sound insulation between rooms",
          "Time-tested building material"
        ],
        whereUsed: ["External Walls", "Internal Partitions", "Compound Walls"],
        benefits: ["Fire Resistant", "Thermal Insulation", "Sound Insulation", "Durable", "Eco Friendly"],
        qualityChecks: ["Compressive Strength Test", "Water Absorption Test", "Dimensional Accuracy", "Efflorescence Test"],
        didYouKnow: "Hollow bricks significantly reduce the dead weight of a building and provide better thermal and sound insulation due to the trapped air inside.",
        constructionTip: "Pre-soak red bricks before use to prevent them from absorbing water from the mortar.",
        brands: [
          {
            name: "A1 Traditional Bricks",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
            description: "Premium quality, kiln-fired traditional red clay bricks known for their compressive strength and classic reliability.",
            confirmed: true,
            country: "India",
            keyBenefits: ["High Compressive Strength", "Classic Reliability", "Good Thermal Mass"],
            whyWeChose: ["Consistent dimensions", "Properly burnt with metallic ringing sound", "Low water absorption"],
          },
          {
            name: "Hollow Electrical Bricks",
            image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80",
            description: "Advanced hollow blocks designed with provisions for electrical conduits, making concealed wiring faster and reducing chiseling.",
            confirmed: true,
            country: "India",
            keyBenefits: ["Easy Concealed Wiring", "Lightweight", "Thermal Insulation"],
            whyWeChose: ["Reduces labor for wall chasing", "Better thermal insulation", "Maintains structural integrity during plumbing/electrical work"],
          },
        ],
      },
      {
        name: "Waterproofing",
        description: "Advanced waterproofing compounds to protect structures from moisture and leakage.",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Waterproofing is the process of making a structure water-resistant so that it remains relatively unaffected by water under specified conditions. It includes liquid applied membranes, crystalline waterproofing, and protective coatings.",
        whyWeUseIt: [
          "Prevents water leakage in bathrooms and terraces",
          "Protects reinforcement steel from corrosion",
          "Stops dampness and peeling of interior paint",
          "Increases the lifespan of the building structure",
          "Prevents mold and mildew growth"
        ],
        whereUsed: ["Terrace", "Bathrooms", "Basement", "Water Tanks", "Balconies", "Foundation Retaining Walls"],
        benefits: ["Leak Proof", "Dampness Prevention", "Protects Steel", "Long Lasting"],
        qualityChecks: ["Ponding Test (48 hours)", "Adhesion Test", "Coverage Verification", "Elongation Check"],
        didYouKnow: "Over 80% of building defects are related to water leakage. Investing in good waterproofing during construction saves 10x the cost in future repairs.",
        constructionTip: "Never tile over a bathroom floor without conducting a 48-hour ponding test on the waterproofing membrane first.",
        brands: [
          {
            name: "Dr. Fixit",
            image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80",
            description: "India's leading waterproofing brand with comprehensive solutions for every part of the building.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 60,
            keyBenefits: ["Comprehensive Range", "Trusted Quality", "Expert Support"],
            whyWeChose: ["Market leader in waterproofing", "Proven product performance", "Strong technical assistance during application"],
            certifications: ["ISO 9001"],
            website: "https://www.drfixit.co.in",
          },
        ],
      },
    ],
  },

  // ───────────────────── MEP ─────────────────────
  {
    name: "MEP",
    icon: Zap,
    color: "#FF6A00",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    description: "Advanced systems for seamless and efficient performance.",
    tagline: "Powering comfort, safety, and modern living",
    materialCount: 3,
    brandCount: 15,
    subcategories: [
      {
        name: "Mechanical",
        description: "Air conditioning, ducting, and ventilation systems for climate comfort.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Mechanical systems encompass all heating, ventilation, and air conditioning (HVAC) systems in a building. This includes split ACs, VRV/VRF systems, centralized air conditioning, ducting, ventilation fans, and exhaust systems. Proper mechanical design ensures energy efficiency, indoor air quality, and thermal comfort throughout the building.",
        whyWeUseIt: [
          "Maintains comfortable indoor temperatures year-round",
          "Ensures proper air circulation and fresh air intake",
          "Controls humidity levels for occupant health",
          "Improves indoor air quality significantly",
          "Energy efficient modern systems reduce electricity costs",
          "Essential for modern comfortable living"
        ],
        whereUsed: ["Living Room", "Bedrooms", "Kitchen", "Basement", "Server Room", "Commercial Spaces"],
        benefits: ["Energy Efficient", "Quiet Operation", "Smart Controls", "Low Maintenance", "Eco Friendly"],
        qualityChecks: ["Energy Rating Verification", "Installation Standards", "Refrigerant Type Check", "Noise Level Testing", "Warranty Verification"],
        didYouKnow: "Inverter AC technology can reduce electricity consumption by up to 50% compared to conventional fixed-speed compressors.",
        constructionTip: "Plan AC placement and piping routes during the structural phase to avoid costly chiseling and routing later.",
        brands: [
          {
            name: "Daikin",
            description: "World leader in air conditioning technology with energy-efficient inverter systems.",
            confirmed: true,
            country: "Japan",
            yearsInBusiness: 100,
            keyBenefits: ["Energy Efficient", "Quiet Operation", "Long Lasting"],
            whyWeChose: ["Global technology leader", "Superior energy efficiency", "Excellent after-sales service", "Wide product range"],
            certifications: ["BEE 5 Star", "ISO 9001"],
            website: "https://www.daikin.co.in",
          },
        ],
      },
      {
        name: "Electrical",
        description: "Wires, switches, MCBs, lighting, and complete electrical solutions.",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Electrical systems encompass all power distribution, lighting, and control components in a building. This includes wiring, conduits, MCBs (Miniature Circuit Breakers), modular switches, sockets, lighting fixtures, earthing systems, and smart home integration. Proper electrical design ensures safety, energy efficiency, and convenience.",
        whyWeUseIt: [
          "Safe power distribution throughout the building",
          "High conductivity ensures efficient energy transfer",
          "Fire resistant insulation prevents electrical hazards",
          "Long operational life reduces replacement costs",
          "Smart home integration for modern living",
          "Compliance with national electrical safety codes"
        ],
        whereUsed: ["All Rooms", "Kitchen", "Bathroom", "Outdoor", "Basement", "Terrace", "Parking"],
        benefits: ["Safe", "Energy Efficient", "Smart Home Ready", "Durable", "Fire Resistant", "Low Maintenance"],
        qualityChecks: ["IS Certification", "Wire Gauge Verification", "Insulation Resistance Test", "Load Calculation Review", "Earthing Test", "MCB Rating Check"],
        didYouKnow: "A single faulty wire connection causes over 30% of residential electrical fires in India. Always use ISI-marked wires and certified electricians.",
        constructionTip: "Plan electrical points during the civil stage itself. Adding points after plastering is expensive and leaves visible patches.",
        qualityStandard: "All electrical work must comply with IS 3043 (Earthing) and National Electrical Code 2023.",
        brands: [
          {
            name: "Havells",
            image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80",
            description: "India's most trusted electrical brand offering a complete range from wires to switches to lighting. Known for flame-retardant technology and elegant design.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 65,
            keyBenefits: ["Flame Retardant", "Shock Proof", "Elegant Design"],
            whyWeChose: ["Complete product ecosystem", "Best-in-class safety features", "Modern aesthetic designs", "Strong warranty support", "Pan-India service network"],
            certifications: ["IS 694", "IS 3854", "ISO 9001", "BIS Certified"],
            website: "https://www.havells.com",
            products: [
              {
                name: "Havells Lifeline Cables",
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80",
                description: "Premium HRFR (Heat Resistant Flame Retardant) cables designed for safe and long-lasting electrical wiring.",
                features: ["HRFR insulation", "Lead-free PVC", "High current carrying capacity", "90°C temperature rating", "IS 694 certified"],
                grade: "HRFR",
                type: "Electrical Cable",
                standard: "IS 694",
                applications: ["House Wiring", "Commercial Wiring", "Industrial Use"],
                benefits: ["Fire safety", "Long life", "Consistent quality", "Environment friendly"],
                expectedLifespan: "25+ years",
                certifications: ["IS 694", "BIS Certified"],
              }
            ]
          },
          {
            name: "Schneider Electric",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=80",
            description: "Global leaders in energy management and automation. Premium switches, MCBs, and smart home solutions.",
            confirmed: true,
            country: "France",
            yearsInBusiness: 185,
            keyBenefits: ["Smart Home Ready", "Energy Efficient", "Global Standards"],
            whyWeChose: ["Global technology leader", "Premium build quality", "Smart home ecosystem", "Excellent safety standards"],
            certifications: ["IEC Standards", "IS 13032", "ISO 9001"],
            website: "https://www.se.com",
          },
          {
            name: "Legrand",
            description: "Premium wiring devices and power distribution systems. Known for antibacterial switches and modular design.",
            confirmed: true,
            country: "France",
            yearsInBusiness: 155,
            keyBenefits: ["Antibacterial Options", "Modular Design", "Highly Reliable"],
            whyWeChose: ["Innovative product design", "Premium finish quality", "Antibacterial technology", "Wide range of styles"],
            certifications: ["IS 3854", "ISO 9001"],
            website: "https://www.legrand.co.in",
          },
        ],
      },
      {
        name: "Plumbing",
        description: "Pipes, fittings, water tanks, bath fittings and sanitary solutions.",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Plumbing encompasses the complete water supply, drainage, and sanitary systems of a building. This includes CPVC/UPVC/SWR pipes, water tanks, pressure pumps, bath fittings (wash basins, showers, faucets), kitchen sinks, and drainage systems. Modern plumbing design ensures leak-proof water distribution, efficient drainage, and premium bathroom experiences.",
        whyWeUseIt: [
          "Leak-proof water distribution throughout the building",
          "Corrosion resistant pipes for long service life",
          "Hygienic water supply with food-grade materials",
          "Efficient drainage prevents waterlogging",
          "Premium bath fittings enhance daily living experience",
          "Easy maintenance and repair access"
        ],
        whereUsed: ["Bathroom", "Kitchen", "Utility Area", "Terrace", "Garden", "Water Tank Room"],
        benefits: ["Leak Proof", "Corrosion Resistant", "Long Lasting", "Easy Maintenance", "Water Efficient", "Hygienic"],
        qualityChecks: ["Pressure Testing", "Joint Integrity Check", "Material Certificate", "Flow Rate Verification", "Leak Detection Test"],
        didYouKnow: "CPVC pipes can handle hot water up to 93°C, making them ideal for both hot and cold water supply lines in residential buildings.",
        constructionTip: "Always conduct a 24-hour pressure test on plumbing lines before concealing them in walls. Fix any leaks before plastering.",
        brands: [
          {
            name: "Finolex Pipes",
            image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80",
            description: "India's leading pipe manufacturer with over 40 years of experience in CPVC, UPVC, and SWR piping systems.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 40,
            keyBenefits: ["Lead Free", "High Flow Rate", "50+ Year Life"],
            whyWeChose: ["Proven 50+ year product life", "Lead-free formulation", "Wide range of sizes", "Strong joint integrity"],
            certifications: ["IS 4985", "IS 15778", "NSF Certified"],
            website: "https://www.finolexpipes.com",
          },
          {
            name: "Astral Pipes",
            description: "Pioneers of CPVC piping systems in India with FlowGuard Plus technology for hot and cold water applications.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 25,
            keyBenefits: ["Hot & Cold Water", "Bio-film Resistant", "High Impact Strength"],
            whyWeChose: ["FlowGuard Plus technology", "Excellent hot water performance", "Bio-film resistant for hygiene", "Pan-India availability"],
            certifications: ["IS 15778", "NSF Certified"],
            website: "https://www.astralpipes.com",
          },
          {
            name: "Jaquar",
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
            description: "Premium bath fittings brand with precision-engineered ceramic disc cartridges delivering a luxurious bathroom experience.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 60,
            keyBenefits: ["Drip-free Performance", "PVD Finishes", "Water Saving"],
            whyWeChose: ["Premium European design", "Superior chrome plating", "Ceramic disc technology", "Wide range of styles", "Strong warranty"],
            certifications: ["IS 8931", "ISO 9001"],
            website: "https://www.jaquar.com",
            products: [
              {
                name: "Jaquar Artize Rainfall Shower",
                image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
                description: "Ultra-premium rainfall shower system with ceiling-mounted overhead shower for a luxurious bathing experience.",
                features: ["Ceiling-mounted rainfall", "Chrome finish", "Air injection technology", "Anti-lime system", "Easy clean nozzles"],
                type: "Rainfall Shower",
                applications: ["Master Bathroom", "Guest Bathroom", "Shower Enclosure"],
                benefits: ["Luxurious experience", "Water efficient", "Easy maintenance", "Premium aesthetics"],
                expectedLifespan: "15+ years",
                warranty: "10 years on body",
              }
            ]
          },
          {
            name: "Kohler",
            image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80",
            description: "Global leader in kitchen and bath products with bold designs and uncompromising functional excellence.",
            confirmed: true,
            country: "USA",
            yearsInBusiness: 150,
            keyBenefits: ["Statement Pieces", "Vibrant Finishes", "Lifetime Warranty"],
            whyWeChose: ["Iconic global brand", "Innovative design philosophy", "Premium material quality", "Lifetime limited warranty"],
            certifications: ["ADA Compliant", "WaterSense Certified"],
            website: "https://www.kohler.co.in",
          },
          {
            name: "Cera",
            description: "Contemporary bath solutions that blend style and comfort at an excellent value proposition.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 45,
            keyBenefits: ["Easy Maintenance", "Wide Range", "Affordable Luxury"],
            whyWeChose: ["Excellent value for money", "Wide product range", "Modern designs", "Good after-sales service"],
            certifications: ["IS 2556", "ISO 9001"],
            website: "https://www.cera-india.com",
          },
        ],
      },
    ],
  },

  // ───────────────────── INTERIOR ─────────────────────
  {
    name: "Interior",
    icon: Paintbrush,
    color: "#2BA745",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    description: "Premium finishes and materials that define your living space.",
    tagline: "Where design meets everyday living",
    materialCount: 11,
    brandCount: 20,
    subcategories: [
      {
        name: "Flooring",
        description: "Marble, tiles, wood, and premium flooring solutions.",
        image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Flooring is the finished surface of a floor that occupants walk on and interact with daily. It encompasses a wide range of materials including marble, vitrified tiles, natural stone, hardwood, engineered wood, SPC, vinyl, and epoxy. The right flooring choice affects aesthetics, durability, maintenance, comfort, and overall property value.",
        whyWeUseIt: [
          "Easy to clean and maintain hygiene",
          "Water and stain resistant surfaces",
          "Scratch resistant for daily wear",
          "Premium aesthetics that define the space",
          "Variety of textures and patterns available",
          "Increases property value significantly"
        ],
        whereUsed: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Balcony", "Entrance Lobby", "Terrace"],
        benefits: ["Easy to Clean", "Water Resistant", "Scratch Resistant", "Premium Finish", "Durable", "Low Maintenance"],
        qualityChecks: ["Surface Flatness", "Shade Consistency", "Water Absorption Test", "Breaking Strength", "Slip Resistance Rating"],
        didYouKnow: "Italian marble like Statuario can cost ₹500-2000 per sq ft, but engineered marble alternatives offer similar aesthetics at 30% lower cost.",
        constructionTip: "Always lay tiles with a slight slope towards the drain in wet areas (1:80 ratio). This prevents water pooling.",
        brands: [
          {
            name: "Kajaria",
            image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=400&q=80",
            description: "India's largest manufacturer of ceramic and vitrified tiles. Known for innovative designs, superior quality, and extensive product range.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 35,
            keyBenefits: ["Scratch Resistant", "Anti-Skid Options", "Large Formats"],
            whyWeChose: ["India's #1 tile brand", "Widest product range", "Consistent quality and shade matching", "Innovative anti-skid technology", "Strong warranty support"],
            certifications: ["IS 15622", "ISO 9001", "ISO 14001"],
            website: "https://www.kajariaceramics.com",
            products: [
              {
                name: "Kajaria Eternity Vitrified Tiles",
                image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=400&q=80",
                description: "Premium large-format vitrified tiles with nano-technology coating for superior stain resistance and lasting beauty.",
                features: ["Nano coating", "Large format 800x1600mm", "Near-zero water absorption", "Digital printing technology", "Anti-bacterial surface"],
                type: "Vitrified",
                applications: ["Living Room", "Lobby", "Commercial Spaces", "Hotel Rooms"],
                benefits: ["Stain proof", "Easy maintenance", "Consistent shade", "Premium look"],
                expectedLifespan: "25+ years",
                certifications: ["IS 15622"],
              }
            ]
          },
        ],
      },
      {
        name: "Wall Finishes",
        description: "Wall tiles, cladding, wallpaper, paneling and decorative surfaces.",
        image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Wall finishes encompass all decorative and protective surface treatments applied to interior and exterior walls. This includes wall tiles, stone cladding, wallpaper, wood paneling, PVC panels, fluted panels, and mirror paneling. Wall finishes transform plain walls into design statements while providing protection against moisture and wear.",
        whyWeUseIt: [
          "Transforms plain walls into design statements",
          "Protects walls from moisture and stains",
          "Adds texture and depth to interiors",
          "Easy to clean and maintain",
          "Hides surface imperfections",
          "Increases aesthetic value of spaces"
        ],
        whereUsed: ["Living Room", "Bedroom", "Bathroom", "Kitchen", "Entrance", "TV Wall", "Prayer Room"],
        benefits: ["Premium Aesthetics", "Moisture Resistant", "Easy Maintenance", "Durable", "Versatile Design"],
        qualityChecks: ["Surface Adhesion Test", "Material Quality", "Color Consistency", "Fire Rating", "VOC Levels"],
        didYouKnow: "Fluted panels are trending in modern Indian homes — they add depth and shadow play to walls while being easy to install and maintain.",
        constructionTip: "For wallpaper in humid areas, always use vinyl wallpaper with proper adhesive. Standard paper wallpaper will peel in Indian humidity.",
        brands: [
          {
            name: "Asian Granito",
            description: "Premium wall cladding and tile solutions with innovative textures and finishes.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 25,
            keyBenefits: ["Wide Range", "Premium Finishes", "Affordable"],
          },
        ],
      },
      {
        name: "Ceiling",
        description: "POP, false ceiling, wood ceiling, and metal ceiling systems.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Ceiling finishes include Plaster of Paris (POP) designs, gypsum false ceilings, wooden ceilings, and metal ceilings. False ceilings serve multiple purposes — they hide electrical conduits and AC ducts, improve acoustics, enable indirect lighting designs, and add architectural character to rooms.",
        whyWeUseIt: [
          "Conceals electrical wiring and AC ducts",
          "Enables beautiful indirect lighting designs",
          "Improves room acoustics and sound insulation",
          "Reduces room height for energy-efficient cooling",
          "Adds architectural character and elegance",
          "Provides access panels for maintenance"
        ],
        whereUsed: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Lobby"],
        benefits: ["Aesthetic Enhancement", "Conceals Services", "Acoustic Control", "Easy Maintenance", "Fire Resistant"],
        qualityChecks: ["Gypsum Board Grade", "Metal Framework Quality", "Fire Rating", "Installation Level Check", "Joint Treatment Quality"],
        didYouKnow: "A well-designed false ceiling with cove lighting can make a room appear 30% larger by creating an illusion of depth and space.",
        constructionTip: "Use moisture-resistant gypsum boards in bathrooms and kitchens. Standard gypsum will sag and deteriorate in humid conditions.",
        brands: [
          {
            name: "Saint-Gobain Gyproc",
            description: "Global leader in gypsum-based ceiling systems with fire and moisture resistant options.",
            confirmed: true,
            country: "France",
            yearsInBusiness: 350,
            keyBenefits: ["Fire Resistant", "Moisture Resistant", "Superior Finish"],
            whyWeChose: ["Global quality standards", "Wide product range", "Superior surface finish", "Fire and moisture resistant options"],
          },
        ],
      },
      {
        name: "Modular Furniture",
        description: "Modular kitchen, wardrobes, TV units, storage and built-in furniture.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Modular furniture refers to pre-manufactured furniture units that are assembled on-site. This includes modular kitchens, wardrobes, TV units, bookshelves, storage units, and walk-in closets. Built using engineered wood (MDF, HDF, particle board) with laminates, acrylics, or veneers, modular furniture offers precision, speed of installation, and consistent quality.",
        whyWeUseIt: [
          "Factory precision ensures consistent quality",
          "Faster installation compared to carpenter-made",
          "Efficient use of space with custom designs",
          "Wide range of finish options and colors",
          "Easy to disassemble and relocate if needed",
          "Better hardware and mechanisms (soft-close, etc.)"
        ],
        whereUsed: ["Kitchen", "Bedroom", "Living Room", "Study", "Dressing Area", "Utility Room"],
        benefits: ["Space Efficient", "Premium Finish", "Quick Installation", "Customizable", "Durable", "Easy Maintenance"],
        qualityChecks: ["Board Grade Verification", "Hardware Quality", "Edge Banding Check", "Soft-close Mechanism Test", "Assembly Accuracy"],
        didYouKnow: "A well-designed modular kitchen can increase your home's resale value by 10-15% and is the most requested feature by home buyers.",
        constructionTip: "Plan modular furniture dimensions during the civil work stage. Ensure accurate wall and floor measurements after tiling is complete.",
        brands: [
          {
            name: "Century Ply",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
            description: "India's leading plywood and laminate brand with ViroKill anti-virus technology and BWR grade products.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 35,
            keyBenefits: ["Borer & Termite Proof", "Boiling Water Proof", "ViroKill Technology"],
            whyWeChose: ["ViroKill anti-virus technology", "BWR grade plywood", "Termite and borer proof", "Consistent quality", "Wide dealer network"],
            certifications: ["IS 303", "IS 710", "ISO 9001"],
            website: "https://www.centuryply.com",
          },
        ],
      },
      {
        name: "Doors",
        description: "Main doors, flush doors, solid wood, laminate, glass, and digital doors.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Doors serve as the primary entry and transition points in a building. They provide security, privacy, sound insulation, and aesthetic appeal. Options range from traditional solid wood doors to modern laminate, glass, sliding, pocket, and smart digital doors. The main door is often the most important design element of a home's entrance.",
        whyWeUseIt: [
          "Provides security and controlled access",
          "Sound insulation between rooms",
          "Privacy for bedrooms and bathrooms",
          "Aesthetic focal point of rooms and entrances",
          "Fire compartmentalization in emergencies",
          "Weather protection for external openings"
        ],
        whereUsed: ["Main Entrance", "Bedrooms", "Bathrooms", "Kitchen", "Balcony", "Pooja Room", "Study"],
        benefits: ["Security", "Sound Insulation", "Aesthetic Appeal", "Privacy", "Fire Resistance", "Weather Protection"],
        qualityChecks: ["Wood Moisture Content", "Hardware Quality", "Lock Mechanism Test", "Surface Finish", "Dimensional Accuracy"],
        didYouKnow: "A premium main door is the first impression of your home. Studies show that an impressive entrance increases perceived property value by up to 5%.",
        constructionTip: "Install door frames during the masonry stage, not after. This ensures perfect alignment and stronger anchoring in the wall.",
        brands: [
          {
            name: "Godrej Locks",
            description: "India's most trusted security brand with digital and mechanical lock solutions for all door types.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 125,
            keyBenefits: ["High Security", "Digital Options", "Trusted Brand"],
            whyWeChose: ["Century-old security expertise", "Wide range of locks", "Excellent after-sales", "Digital lock options"],
          },
        ],
      },
      {
        name: "Windows",
        description: "Aluminium, uPVC, sliding, casement windows and glass solutions.",
        image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Windows are openings in walls designed for natural light, ventilation, and visual connection with the outside. Modern window systems use aluminium or uPVC frames with toughened or double-glazed glass for superior thermal insulation, sound reduction, and weather resistance. Options include sliding, casement, tilt-and-turn, and fixed windows.",
        whyWeUseIt: [
          "Maximizes natural light to reduce electricity usage",
          "Provides controlled ventilation and airflow",
          "Sound insulation for peaceful interiors",
          "Thermal insulation reduces AC load",
          "Weather protection against rain and wind",
          "Enhances exterior architectural aesthetics"
        ],
        whereUsed: ["Living Room", "Bedrooms", "Kitchen", "Bathroom", "Staircase", "Facade"],
        benefits: ["Natural Light", "Sound Insulation", "Thermal Insulation", "Weather Resistant", "Low Maintenance", "Security"],
        qualityChecks: ["Frame Profile Quality", "Glass Thickness", "Seal Integrity", "Hardware Mechanism", "Wind Load Rating"],
        didYouKnow: "Double-glazed windows can reduce external noise by up to 70% and cut AC costs by 25% through superior thermal insulation.",
        constructionTip: "Specify window dimensions and sill levels during the structural design phase. This avoids costly modifications during finishing.",
        brands: [
          {
            name: "Fenesta",
            image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=400&q=80",
            description: "A Tata Enterprise offering factory-sealed uPVC window systems with exceptional noise reduction and zero maintenance.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 20,
            keyBenefits: ["Noise Reduction", "Dust Proof", "Zero Maintenance"],
            whyWeChose: ["Tata Group quality", "Factory-sealed systems", "Superior acoustic insulation", "Weather-tight performance", "Zero maintenance uPVC"],
            certifications: ["IS 14856", "ISO 9001"],
            website: "https://www.fenesta.com",
          },
        ],
      },
      {
        name: "Staircase",
        description: "Wooden, glass, steel staircases and premium railings.",
        image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Staircases are the vertical circulation systems connecting different floor levels. Modern staircases are designed as architectural statements, using materials like wood, glass, steel, and natural stone. Railings and balustrades provide safety while contributing to the overall design aesthetic of the space.",
        whyWeUseIt: [
          "Essential vertical circulation between floors",
          "Architectural focal point of interior design",
          "Safety through proper railing design",
          "Space-efficient designs maximize usable area",
          "Material choices create distinct design statements",
          "Adds significant value to multi-storey homes"
        ],
        whereUsed: ["Entrance Hall", "Living Room", "Duplex", "Villa", "Penthouse"],
        benefits: ["Architectural Statement", "Safety", "Space Efficient", "Durable", "Premium Design"],
        qualityChecks: ["Riser Height Consistency", "Tread Width", "Railing Height", "Anti-slip Surface", "Structural Load Capacity"],
        didYouKnow: "The ideal riser height for comfortable staircase use is 150-175mm. Each step should be exactly the same height — even a 5mm difference causes stumbling.",
        constructionTip: "Always finalize staircase design before starting structural work. Retrofit staircases are expensive and often compromise on ideal dimensions.",
        brands: [
          {
            name: "Custom Fabrication",
            description: "Premium custom-designed staircases fabricated with architect-specified materials and finishes.",
            confirmed: true,
            keyBenefits: ["Custom Design", "Premium Materials", "Architectural Integration"],
          },
        ],
      },
      {
        name: "Kitchen",
        description: "Cabinets, countertops, sinks, chimneys, hobs and kitchen appliances.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "The kitchen is the most functionally complex room in a home, requiring careful coordination of cabinetry, countertops, sinks, faucets, chimneys, hobs, ovens, and storage systems. Modern kitchen design follows the work triangle principle (sink-hob-refrigerator) for optimal workflow efficiency.",
        whyWeUseIt: [
          "Efficient cooking and food preparation workspace",
          "Organized storage for utensils and provisions",
          "Easy to clean and maintain hygiene",
          "Premium aesthetics enhance daily living",
          "Smart appliances reduce cooking effort",
          "Proper ventilation through chimney systems"
        ],
        whereUsed: ["Main Kitchen", "Pantry", "Utility Kitchen", "Outdoor Kitchen", "Bar Counter"],
        benefits: ["Space Efficient", "Easy to Clean", "Premium Finish", "Smart Appliances", "Organized Storage"],
        qualityChecks: ["Countertop Material Grade", "Cabinet Board Quality", "Hardware Mechanism Test", "Sink Material Verification", "Chimney Suction Power"],
        didYouKnow: "A well-designed kitchen work triangle (sink-hob-fridge) with total perimeter of 4-8 meters optimizes cooking efficiency by up to 40%.",
        constructionTip: "Finalize kitchen layout before tiling and plumbing rough-in. Moving drain and water points after tiling is very expensive.",
        brands: [
          {
            name: "Hafele",
            description: "German precision hardware and kitchen solutions with innovative storage and organization systems.",
            confirmed: true,
            country: "Germany",
            yearsInBusiness: 100,
            keyBenefits: ["German Engineering", "Innovative Storage", "Premium Quality"],
            whyWeChose: ["World-class hardware quality", "Innovative storage solutions", "Soft-close mechanisms", "Premium finish options"],
            certifications: ["ISO 9001"],
            website: "https://www.?"
          },
        ],
      },
      {
        name: "Bathroom",
        description: "Sanitaryware, mirrors, cabinets, shower enclosures and accessories.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Bathroom design encompasses sanitaryware (WC, wash basins), shower enclosures, bath fittings, mirrors, vanity cabinets, glass partitions, storage units, and accessories. A well-designed bathroom balances functionality with luxury, creating a spa-like personal retreat within the home.",
        whyWeUseIt: [
          "Essential hygiene and personal care space",
          "Premium fixtures enhance daily wellness",
          "Proper waterproofing prevents structural damage",
          "Water-efficient fixtures reduce water bills",
          "Spa-like experience improves quality of life",
          "Well-designed bathrooms increase property value"
        ],
        whereUsed: ["Master Bathroom", "Common Bathroom", "Guest Bathroom", "Powder Room", "Pool Bathroom"],
        benefits: ["Hygiene", "Water Efficient", "Premium Experience", "Easy Maintenance", "Durable"],
        qualityChecks: ["Waterproofing Test", "Slope Verification", "Fixture Quality", "Drain Performance", "Ventilation Check"],
        didYouKnow: "A bathroom with proper ventilation (exhaust fan) and waterproofing can last 25+ years without major repairs. Without these, problems start within 3-5 years.",
        constructionTip: "Apply 3 coats of waterproofing membrane in the bathroom before tiling. Test with 48-hour ponding test before proceeding.",
        brands: [
          {
            name: "Kohler",
            description: "Premium sanitaryware and bath fittings with bold designs and innovative technology.",
            confirmed: true,
            country: "USA",
            yearsInBusiness: 150,
            keyBenefits: ["Premium Design", "Innovative Technology", "Global Quality"],
            whyWeChose: ["Iconic brand", "Superior design quality", "Innovative smart features", "Lifetime limited warranty"],
            website: "https://www.kohler.co.in",
          },
        ],
      },
      {
        name: "Lighting",
        description: "Decorative, pendant, wall, profile, cove and smart lighting.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Interior lighting design uses layers of ambient, task, accent, and decorative lighting to create mood, functionality, and architectural emphasis. Modern options include LED panels, profile lights, cove lights, pendant lights, wall sconces, and smart lighting systems with color temperature and dimming control.",
        whyWeUseIt: [
          "Creates ambiance and mood in every room",
          "Provides task lighting for work areas",
          "Highlights architectural features and art",
          "Energy efficient LED technology reduces costs",
          "Smart controls offer convenience and scenes",
          "Enhances interior design and perceived space"
        ],
        whereUsed: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining", "Study", "Staircase", "Outdoor"],
        benefits: ["Energy Efficient", "Mood Setting", "Smart Controls", "Long Life", "Low Heat", "Eco Friendly"],
        qualityChecks: ["Lumen Output", "Color Temperature", "CRI (Color Rendering Index)", "Wattage Efficiency", "Driver Quality"],
        didYouKnow: "Proper lighting design uses 3 layers — ambient (general), task (functional), and accent (decorative) — to create a complete and comfortable environment.",
        constructionTip: "Plan all lighting points during the electrical rough-in stage. Adding false ceiling lights later requires re-doing the ceiling section.",
        brands: [
          {
            name: "Philips",
            description: "Global leader in lighting technology with extensive LED, smart lighting, and architectural lighting solutions.",
            confirmed: true,
            country: "Netherlands",
            yearsInBusiness: 130,
            keyBenefits: ["Energy Efficient", "Smart Home", "Premium Quality"],
            whyWeChose: ["Global technology leader", "Widest product range", "Smart home integration", "Excellent color rendering"],
            certifications: ["BEE Star Rating", "ISO 9001"],
          },
        ],
      },
      {
        name: "Soft Furnishings",
        description: "Curtains, blinds, carpets, rugs and upholstery fabrics.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Soft furnishings are the fabric-based elements that add warmth, color, texture, and personality to interiors. This includes curtains, blinds, carpets, rugs, cushions, and upholstery. They play a crucial role in acoustics, light control, thermal insulation, and overall comfort of the living space.",
        whyWeUseIt: [
          "Adds warmth and personality to interiors",
          "Controls natural light through curtains and blinds",
          "Improves room acoustics and sound quality",
          "Provides thermal insulation at windows",
          "Creates design cohesion and color harmony",
          "Adds comfort and tactile quality to spaces"
        ],
        whereUsed: ["Living Room", "Bedrooms", "Dining Room", "Study", "Home Theater"],
        benefits: ["Comfort", "Aesthetic Enhancement", "Light Control", "Sound Absorption", "Thermal Insulation"],
        qualityChecks: ["Fabric Quality", "Color Fastness", "Fire Retardant Rating", "UV Resistance", "Washability"],
        didYouKnow: "Blackout curtains can reduce room temperature by 5-10°C and save up to 25% on AC electricity costs during summer months.",
        constructionTip: "Install curtain tracks during the false ceiling stage for a seamless, built-in look. Surface-mounted tracks look less premium.",
        brands: [
          {
            name: "D'Decor",
            description: "India's largest home textile brand with premium curtain fabrics, upholstery, and bed linen collections.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 25,
            keyBenefits: ["Premium Fabrics", "Wide Range", "Stain Resistant"],
          },
        ],
      },
    ],
  },

  // ───────────────────── FINISHING ─────────────────────
  {
    name: "Finishing",
    icon: Sparkles,
    color: "#6C5CE7",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    description: "The final touch that brings perfection to every detail.",
    tagline: "Perfection is in the details",
    materialCount: 7,
    brandCount: 15,
    subcategories: [
      {
        name: "Paint",
        description: "Interior, exterior, texture, decorative paints and wood polishes.",
        image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Paint is the final protective and decorative coating applied to interior and exterior surfaces. It includes wall emulsions, exterior weather coats, texture paints, decorative finishes, wood polishes (PU, melamine), and specialty coatings. Quality paint protects surfaces from moisture, UV damage, and wear while providing the desired aesthetic finish.",
        whyWeUseIt: [
          "Protects walls from moisture and weather damage",
          "Prevents algae, fungus, and microbial growth",
          "Improves interior and exterior aesthetics",
          "Creates desired color schemes and moods",
          "Long-lasting finish reduces repainting frequency",
          "Specialized paints offer waterproofing and heat reflection"
        ],
        whereUsed: ["Interior Walls", "Exterior Walls", "Ceiling", "Wood Surfaces", "Metal Surfaces", "Texture Walls"],
        benefits: ["Weather Resistant", "Anti-fungal", "Low VOC", "Washable", "Eco Friendly", "Long Lasting"],
        qualityChecks: ["VOC Level Certification", "Coverage Rate", "Washability Cycles", "Color Consistency", "Adhesion Test", "Weather Resistance Rating"],
        didYouKnow: "Premium interior paints now offer 20,000+ wash cycles — meaning you can clean the walls frequently without affecting the finish or color.",
        constructionTip: "Apply 2 coats of primer before painting. Primer improves paint adhesion by 60% and ensures uniform color across the entire wall.",
        qualityStandard: "All paints must comply with IS 15489 (interior) and IS 15477 (exterior) standards for quality and safety.",
        brands: [
          {
            name: "Asian Paints",
            image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=400&q=80",
            description: "India's largest paint company and Asia's third-largest. Known for innovation, quality, and the widest color palette in the industry.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 80,
            keyBenefits: ["Teflon Surface Protector", "Anti-bacterial", "Odourless"],
            whyWeChose: ["Market leader with proven quality", "Widest color palette (3000+ shades)", "Innovative Teflon surface protector technology", "Low VOC formulations", "Excellent dealer and application support"],
            certifications: ["IS 15489", "IS 15477", "ISO 9001", "Green Pro Certified"],
            website: "https://www.asianpaints.com",
            products: [
              {
                name: "Asian Paints Royale Luxury Emulsion",
                image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=400&q=80",
                description: "Ultra-premium interior emulsion with Teflon Surface Protector technology for stain-resistant, washable walls with a luxurious sheen.",
                features: ["Teflon Surface Protector", "Anti-bacterial", "Low VOC", "Washable up to 20,000 cycles", "Smooth silk finish"],
                type: "Interior Emulsion",
                standard: "IS 15489",
                applications: ["Living Room", "Bedrooms", "Dining Room", "Study"],
                benefits: ["Stain resistant", "Easy to clean", "Premium finish", "Odourless", "Environment friendly"],
                expectedLifespan: "7-10 years",
                certifications: ["IS 15489", "Green Pro"],
              },
              {
                name: "Asian Paints Apex Ultima",
                image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
                description: "Premium exterior weather-proof paint with advanced silicone technology for lasting protection against rain, sun, and pollution.",
                features: ["Silicone enhanced", "Dust-resistant", "Anti-algal", "UV protective", "Rain resistant"],
                type: "Exterior Emulsion",
                standard: "IS 15477",
                applications: ["Exterior Walls", "Boundary Walls", "Compound Walls"],
                benefits: ["All-weather protection", "Color retention", "Anti-algal", "Dust proof"],
                expectedLifespan: "8-12 years",
              }
            ]
          },
        ],
      },
      {
        name: "Hardware",
        description: "Door handles, locks, hinges, soft-close systems and cabinet hardware.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Architectural hardware encompasses all the functional metal components that enable doors, windows, cabinets, and drawers to operate. This includes door handles, mortise locks, digital locks, hinges, drawer channels, soft-close systems, tower bolts, and door closers. Quality hardware directly affects the daily user experience and longevity of fitted elements.",
        whyWeUseIt: [
          "Essential for functional operation of doors and cabinets",
          "Security through quality lock mechanisms",
          "Smooth operation with premium mechanisms",
          "Soft-close systems prevent slamming noise",
          "Premium finish enhances overall interior quality",
          "Digital locks provide keyless convenience"
        ],
        whereUsed: ["All Doors", "Kitchen Cabinets", "Wardrobes", "Drawers", "Windows", "Bathroom"],
        benefits: ["Security", "Smooth Operation", "Durable", "Premium Finish", "Low Maintenance"],
        qualityChecks: ["Finish Quality", "Mechanism Smoothness", "Load Capacity", "Corrosion Resistance Test", "Cycle Life Test"],
        didYouKnow: "Premium soft-close hinges are rated for 50,000+ cycles — that's opening and closing the door 14 times a day for 10 years without failure.",
        constructionTip: "Select hardware finishes (chrome, brass, matte black, etc.) before ordering. Mixing finishes in the same room looks inconsistent.",
        brands: [
          {
            name: "Hafele",
            description: "German precision architectural hardware with comprehensive solutions for doors, kitchens, and furniture.",
            confirmed: true,
            country: "Germany",
            yearsInBusiness: 100,
            keyBenefits: ["German Quality", "Wide Range", "Premium Finishes"],
            whyWeChose: ["World-class quality and precision", "Comprehensive product range", "Premium finish options", "Reliable after-sales support"],
            certifications: ["ISO 9001", "EN Standards"],
            website: "https://www.?"
          },
        ],
      },
      {
        name: "Glass",
        description: "Toughened, tinted, frosted, decorative and mirror glass solutions.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Architectural glass is used extensively in modern construction for windows, doors, partitions, facades, railings, shower enclosures, and decorative elements. Types include toughened (tempered) glass, laminated glass, insulated glass units (IGU), frosted glass, tinted glass, and mirror glass. Glass transforms spaces by maximizing light while providing safety and privacy.",
        whyWeUseIt: [
          "Maximizes natural light penetration",
          "Creates visual spaciousness in interiors",
          "Toughened glass ensures safety (breaks into small cubes)",
          "Sound insulation with laminated and double-glazed options",
          "Modern aesthetic for contemporary design",
          "Versatile — used in facades, partitions, railings, and more"
        ],
        whereUsed: ["Windows", "Doors", "Shower Enclosures", "Railings", "Partitions", "Facade", "Staircase"],
        benefits: ["Safety", "Light Transmission", "Sound Insulation", "Modern Aesthetic", "Durable", "Easy to Clean"],
        qualityChecks: ["Thickness Verification", "Toughening Certificate", "Edge Finish Quality", "Flatness Test", "Impact Resistance Test"],
        didYouKnow: "Toughened glass is 4-5 times stronger than regular glass and when broken, it shatters into small cubical pieces instead of sharp shards — significantly reducing injury risk.",
        constructionTip: "Always specify toughened glass for doors, partitions, and areas where human impact is possible. Regular glass in these locations is a serious safety hazard.",
        brands: [
          {
            name: "Saint-Gobain",
            description: "World's largest glass manufacturer with a complete range of architectural glass solutions.",
            confirmed: true,
            country: "France",
            yearsInBusiness: 350,
            keyBenefits: ["Global Leader", "Complete Range", "Superior Quality"],
            whyWeChose: ["World's largest glass maker", "Complete product range", "Consistent quality", "Strong technical support"],
          },
        ],
      },
      {
        name: "Sealants",
        description: "Silicone, PU, acrylic sealants, epoxy grout and tile adhesives.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Sealants and adhesives are critical finishing materials that fill gaps, seal joints, bond materials, and provide waterproofing at junctions. This includes silicone sealants (for glass and sanitary joints), PU sealants (for expansion joints), acrylic sealants (for internal gaps), epoxy grout (for tile joints), and tile adhesives (for bonding tiles to surfaces).",
        whyWeUseIt: [
          "Prevents water leakage at joints and junctions",
          "Provides flexible sealing that accommodates movement",
          "Creates clean, finished joints between materials",
          "Epoxy grout prevents staining and microbial growth",
          "Tile adhesive enables thin-bed fixing for uniform finish",
          "Essential for waterproofing bathroom and kitchen joints"
        ],
        whereUsed: ["Bathroom Joints", "Kitchen Counter Joints", "Glass Joints", "Window Perimeter", "Expansion Joints", "Tile Joints"],
        benefits: ["Waterproof", "Flexible", "Durable", "Clean Finish", "Mold Resistant"],
        qualityChecks: ["Adhesion Test", "Elongation Check", "UV Resistance", "Mold Resistance", "Expiry Date Verification"],
        didYouKnow: "Epoxy grout is 100% waterproof and stain-proof, unlike cement grout which absorbs moisture and stains over time. It's ideal for kitchen counters and bathrooms.",
        constructionTip: "Always use food-grade silicone sealant around kitchen sinks and countertops. Industrial-grade silicone may release harmful chemicals.",
        brands: [
          {
            name: "Pidilite (Dr. Fixit)",
            description: "India's leading adhesive and sealant company with comprehensive construction chemical solutions.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 60,
            keyBenefits: ["Trusted Brand", "Wide Range", "Proven Quality"],
            whyWeChose: ["Market leader in construction chemicals", "Comprehensive product range", "Proven performance", "Strong technical support"],
            certifications: ["IS Standards", "ISO 9001"],
          },
        ],
      },
      {
        name: "Exterior",
        description: "Facades, stone cladding, ACP panels, HPL panels and pergolas.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Exterior finishing encompasses all visible outer surface treatments of a building including facade systems, stone cladding, ACP (Aluminium Composite Panels), HPL (High Pressure Laminate) panels, glass curtain walls, texture finishes, pergolas, and terrace decking. The exterior finish defines the building's visual identity and protects it from weather.",
        whyWeUseIt: [
          "Defines the visual identity and curb appeal of the building",
          "Protects structure from rain, sun, wind, and pollution",
          "Provides thermal insulation reducing energy costs",
          "Creates a modern, premium architectural expression",
          "Increases property value significantly",
          "Low maintenance compared to conventional plastering and painting"
        ],
        whereUsed: ["Building Facade", "Entrance", "Terrace", "Balcony", "Compound Wall", "Pergola", "Parking"],
        benefits: ["Weather Protection", "Premium Aesthetics", "Thermal Insulation", "Low Maintenance", "Durable", "Modern Design"],
        qualityChecks: ["Material Grade", "Fire Rating", "UV Resistance", "Wind Load Rating", "Installation Quality"],
        didYouKnow: "ACP panels used in building facades must be fire-rated (A2/B1 grade). Non-fire-rated ACP panels have been the cause of major building fires worldwide.",
        constructionTip: "Always use fire-rated ACP panels (A2 or B1 grade) for building facades. Check the fire test certificate before procurement.",
        brands: [
          {
            name: "Aludecor",
            description: "India's leading ACP panel manufacturer with fire-rated aluminum composite panels for modern facades.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 20,
            keyBenefits: ["Fire Rated", "Weather Resistant", "Premium Finishes"],
            whyWeChose: ["Fire-rated panels", "Wide color range", "Premium finish quality", "Strong technical support"],
          },
        ],
      },
      {
        name: "Landscaping",
        description: "Grass, pavers, decking, outdoor lighting, plants and water features.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Landscaping transforms outdoor spaces into functional and beautiful extensions of the home. It includes lawn grass, paver blocks, wooden/composite decking, outdoor lighting, plants and trees, boundary walls, water features, and hardscape elements. Good landscaping connects indoor and outdoor living while increasing property value.",
        whyWeUseIt: [
          "Creates beautiful outdoor living spaces",
          "Increases property value by 10-15%",
          "Provides relaxation and recreation areas",
          "Improves microclimate around the building",
          "Manages rainwater drainage naturally",
          "Enhances privacy with green barriers"
        ],
        whereUsed: ["Front Yard", "Backyard", "Terrace Garden", "Balcony", "Rooftop", "Swimming Pool Area", "Driveway"],
        benefits: ["Aesthetic Enhancement", "Property Value", "Eco Friendly", "Relaxation Space", "Microclimate Control"],
        qualityChecks: ["Soil Quality", "Drainage Slope", "Plant Suitability", "Irrigation System", "Lighting Design"],
        didYouKnow: "Well-designed landscaping can reduce ambient temperature around your home by 5-8°C during summer through shade and evapotranspiration.",
        constructionTip: "Plan irrigation lines and outdoor electrical points during the civil work stage. Digging after landscaping destroys the finished work.",
        brands: [
          {
            name: "Local Landscape Partners",
            description: "Carefully selected landscape architects and contractors with proven track records in premium residential projects.",
            confirmed: true,
            keyBenefits: ["Custom Design", "Local Climate Knowledge", "Quality Plants"],
          },
        ],
      },
      {
        name: "Final Fixtures",
        description: "Name plates, house numbers, mail boxes, door bells and canopies.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Final fixtures are the last items installed before handover. These small but impactful elements include name plates, house numbers, mailboxes, door bells (video and smart options), railings, canopies, and pergolas. They complete the building's personality and provide essential everyday functionality.",
        whyWeUseIt: [
          "Completes the building's visual identity",
          "Provides essential everyday functionality",
          "Smart doorbells enhance security",
          "Premium name plates create lasting first impressions",
          "Canopies protect entrances from rain and sun",
          "Railings ensure safety at balconies and terraces"
        ],
        whereUsed: ["Main Entrance", "Gate", "Balcony", "Terrace", "Parking", "Garden"],
        benefits: ["First Impression", "Security", "Safety", "Convenience", "Aesthetic Completion"],
        qualityChecks: ["Material Quality", "Finish Durability", "Installation Security", "Weather Resistance", "Electrical Safety (for smart devices)"],
        didYouKnow: "A premium name plate and well-designed entrance area can increase the perceived value of your home by up to 3% according to real estate studies.",
        constructionTip: "Order custom name plates and house numbers at least 4-6 weeks before handover. Custom metal and stone work takes time to fabricate.",
        brands: [
          {
            name: "Custom Artisan",
            description: "Premium custom-fabricated final fixtures including name plates, house numbers, and decorative elements.",
            confirmed: true,
            keyBenefits: ["Custom Design", "Premium Materials", "Unique Identity"],
          },
        ],
      },
      {
        name: "Lighting (Exterior)",
        description: "Outdoor, landscape, security and architectural lighting.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
        whatIsIt: "Exterior lighting enhances safety, security, and architectural beauty of outdoor spaces. It includes facade lighting, garden lights, pathway lights, security flood lights, bollard lights, and smart outdoor lighting systems.",
        whyWeUseIt: [
          "Enhances building's nighttime appearance",
          "Improves safety along pathways and stairs",
          "Provides security illumination",
          "Creates ambiance in garden and outdoor spaces",
          "Highlights architectural features",
          "Smart controls for convenience and energy savings"
        ],
        whereUsed: ["Facade", "Garden", "Driveway", "Entrance", "Terrace", "Pool Area", "Boundary Wall"],
        benefits: ["Safety", "Security", "Aesthetic Enhancement", "Energy Efficient", "Weather Proof"],
        qualityChecks: ["IP Rating", "Lumen Output", "Energy Rating", "Weather Resistance", "Installation Quality"],
        didYouKnow: "IP65 rated outdoor lights are dust-tight and protected against water jets from any direction — essential for Indian monsoon conditions.",
        constructionTip: "Use IP65 or higher rated fixtures for all outdoor lighting. Lower IP ratings will corrode and fail within 2-3 monsoon seasons.",
        brands: [
          {
            name: "Syska",
            image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80",
            description: "High-CRI smart LED systems providing consistent, flawless color rendering for exterior applications.",
            confirmed: true,
            country: "India",
            yearsInBusiness: 25,
            keyBenefits: ["Energy Efficient", "Flicker Free", "Smart Controls"],
            whyWeChose: ["Excellent energy efficiency", "High CRI for true color rendering", "Smart lighting options", "Weather-proof outdoor range"],
            certifications: ["BEE Star Rated", "BIS Certified"],
            website: "https://www.?"
          },
        ],
      },
    ],
  },
];
