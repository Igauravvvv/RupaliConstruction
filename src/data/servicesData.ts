export interface ServiceStep {
  number: string;
  title: string;
  duration: string;
  desc: string;
  deliverables: string[];
}

export interface ServiceCheck {
  title: string;
  desc: string;
  standard: string;
  iconName?: string;
}

export interface ServiceUSP {
  title: string;
  desc: string;
  badge?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceDetailItem {
  id: string;
  slug: string;
  aliases?: string[];
  title: string;
  shortTitle: string;
  tagline: string;
  heroImage: string;
  iconName: "Home" | "Building2" | "Hammer" | "Paintbrush" | "Compass" | "HardHat";
  overview: string;
  projectTypeFilter: "residential" | "commercial" | "renovation" | "interior";
  highlights: { label: string; value: string }[];
  steps: ServiceStep[];
  checks: ServiceCheck[];
  usps: ServiceUSP[];
  faqs: ServiceFAQ[];
  consultationCTA: {
    title: string;
    description: string;
    buttonText: string;
    whatsappMessage: string;
  };
}

export const servicesData: ServiceDetailItem[] = [
  {
    id: "residential-construction",
    slug: "residential-construction",
    aliases: ["turnkey", "turnkey-construction", "residential"],
    title: "Luxury Residential & Turnkey Villa Construction",
    shortTitle: "Residential Construction",
    tagline: "End-to-end bespoke home building in DLF, Sushant Lok, and Gurgaon with precision civil engineering.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
    iconName: "Home",
    projectTypeFilter: "residential",
    overview: "We engineer and construct custom luxury villas, builder floors, and multi-generational residences from empty plots to finished turnkey homes. With our integrated in-house architecture, structural engineering, and construction management teams, we deliver uncompromising luxury with fixed pricing and guaranteed timelines.",
    highlights: [
      { label: "Completed Homes", value: "150+ in NCR" },
      { label: "Structural Warranty", value: "10 Years" },
      { label: "Cost Overruns", value: "0% Guaranteed" },
      { label: "Standard Delivery", value: "12-14 Months" },
    ],
    steps: [
      {
        number: "01",
        title: "Soil Investigation & Feasibility Study",
        duration: "Week 1 - 2",
        desc: "Comprehensive geotechnical soil testing (SPT) to determine safe bearing capacity, water table depth, and seismic zone IV foundation parameters. Site contour mapping and municipal setback verification.",
        deliverables: ["Geotechnical Soil Report", "Topographical Plot Survey", "DTCP / HSVP Bye-Law Audit"],
      },
      {
        number: "02",
        title: "Architectural Planning & Vastu Alignment",
        duration: "Week 3 - 5",
        desc: "Interactive design sessions with senior architects crafting 2D layouts, spatial flow, Vastu directional energy mapping, and 3D hyper-realistic exterior elevation renders.",
        deliverables: ["2D Master Floor Plans", "Vastu Compliance Map", "3D Photorealistic Exterior Renders"],
      },
      {
        number: "03",
        title: "Structural Engineering & Itemized BoQ",
        duration: "Week 6 - 7",
        desc: "ETABS structural analysis, foundation detailing with Tata Tiscon Fe-550D rebar schedules, and a transparent, locked Bill of Quantities (BoQ) specifying every brand down to the screw.",
        deliverables: ["STAAD/ETABS Structural Drawings", "Bar Bending Schedules (BBS)", "Zero-Deviation Fixed BoQ"],
      },
      {
        number: "04",
        title: "Substructure & RCC Superstructure",
        duration: "Month 3 - 7",
        desc: "Anti-termite treated excavation, Raft/Column casting using UltraTech M25/M30 grade RMC, reinforced brick masonry with cured mortar joints, and vibration-compacted floor slabs.",
        deliverables: ["Cube Compressive Test Reports", "Steel Tensile Certifications", "Daily WhatsApp Progress Video"],
      },
      {
        number: "05",
        title: "MEP, Concealed Systems & Waterproofing",
        duration: "Month 8 - 11",
        desc: "Multi-layer German polymer waterproofing on basements, sunken slabs, and terraces with 72-hour ponding flood tests. Ashirvad CPVC plumbing with 10-bar pressure tests and Havells FRLS electrical conduits.",
        deliverables: ["Hydrostatic Pressure Certificates", "Flood Test Photographic Logs", "Concealed MEP As-Built Plans"],
      },
      {
        number: "06",
        title: "Finishing, 150-Point Audit & Handover",
        duration: "Month 12 - 14",
        desc: "Laser-leveled Italian marble, double-glazed soundproof fenestration, premium sanitary fittings, complete pre-delivery snag audit, deep chemical polishing, and formal key handover.",
        deliverables: ["150-Point Quality Sign-off", "10-Year Structural Warranty Card", "Turnkey Possession Package"],
      },
    ],
    checks: [
      {
        title: "Concrete Compressive Strength",
        desc: "Every RMC batch is tested via cube crush testing at 7, 14, and 28 days to verify M25/M30 strength compliance.",
        standard: "IS 456 & IS 516 Certified",
      },
      {
        title: "Digital Laser Plumb & Level",
        desc: "All structural columns, brick walls, and finished plaster undergo digital laser alignment for absolute 90° corners.",
        standard: "Zero Plumb Tolerance (±2mm)",
      },
      {
        title: "72-Hour Waterproofing Flood Test",
        desc: "All wet areas, balconies, basements, and roof terraces are submerged under 4 inches of water for 72 continuous hours.",
        standard: "100% Zero-Dampness Guarantee",
      },
      {
        title: "10-Bar Hydrostatic Plumbing Test",
        desc: "All concealed water lines are pressurized to 10 bar for 24 hours to guarantee zero hidden joint leaks inside walls.",
        standard: "DIN 1988 Plumbing Code",
      },
      {
        title: "Tata Tiscon Fe-550D Rebar Verification",
        desc: "Direct mill-test certificates for high-ductility seismic rebars with anti-corrosion coating.",
        standard: "IS 1786 Grade Fe-550D",
      },
      {
        title: "Electrical Megger Insulation Test",
        desc: "High-voltage insulation resistance testing across all wiring circuits to prevent electrical leakage or short-circuits.",
        standard: "IS 732 Wiring Standard",
      },
    ],
    usps: [
      {
        title: "10-Year Structural Warranty",
        desc: "Legally backed structural guarantee covering foundation, RCC framework, and load-bearing structures for a decade.",
        badge: "Guaranteed",
      },
      {
        title: "0% Cost Overrun Lock",
        desc: "Itemized fixed-price contract. What is quoted in the initial BoQ is what you pay—no surprise mid-project bills.",
        badge: "Fixed Price",
      },
      {
        title: "Daily WhatsApp & Drone Logs",
        desc: "Receive daily photo logs, high-definition videos, and periodic drone footage of your plot directly on WhatsApp.",
        badge: "Transparent",
      },
      {
        title: "Grade-A Branded Materials Only",
        desc: "We exclusively partner with Tata Steel, UltraTech Cement, Havells, Kohler, Fenesta, and Asian Paints.",
        badge: "100% Genuine",
      },
    ],
    faqs: [
      {
        question: "How long does it take to construct a 500 sq yd luxury villa in Gurgaon?",
        answer: "A standard 500 sq yd turnkey villa with basement, stilt, and 3 upper floors typically takes 12 to 14 months from excavation to final turnkey handover, including internal finishes and testing.",
      },
      {
        question: "Do you handle building plan approvals from DTCP / HSVP / MCG?",
        answer: "Yes, our in-house liaison architects manage the entire sanction drawing preparation, authority submission, structural stability certificates, and occupancy certificate (OC) clearances.",
      },
      {
        question: "Can I customize floor plans and interior specifications during construction?",
        answer: "Absolutely. All architectural layouts and material choices are finalized with your input during Phase 2 before civil execution begins, ensuring zero wasted rework.",
      },
    ],
    consultationCTA: {
      title: "Book a Turnkey Construction Consultation",
      description: "Meet with our Principal Architect & Structural Engineers at our Gurgaon studio or directly at your plot.",
      buttonText: "Book Construction Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Turnkey Residential Construction in Gurgaon.",
    },
  },
  {
    id: "renovation",
    slug: "renovation",
    aliases: ["villa-renovation", "remodeling", "home-renovation"],
    title: "Structural Renovation & Villa Modernization",
    shortTitle: "Renovation",
    tagline: "Transforming existing Gurgaon properties with structural upgrades, modern façades, and luxury MEP overhauls.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    iconName: "Hammer",
    projectTypeFilter: "renovation",
    overview: "Whether you need to modernize an older villa in DLF Phases 1-4, add a new floor, expand living areas with open-plan layouts, or replace failing plumbing and electrical infrastructure, Rupali Construction delivers turnkey structural renovations with zero compromise on safety.",
    highlights: [
      { label: "Renovated Villas", value: "65+ Delivered" },
      { label: "Seepage Warranty", value: "5 Years" },
      { label: "Structural Safety", value: "100% Certified" },
      { label: "Fast-Track Option", value: "45-90 Days" },
    ],
    steps: [
      {
        number: "01",
        title: "Structural Health Audit & Moisture Scanning",
        duration: "Days 1 - 5",
        desc: "Non-destructive testing (NDT) including rebound hammer testing on existing columns, thermal imaging for hidden pipe leaks, and digital dampness mapping across walls.",
        deliverables: ["NDT Structural Health Report", "Thermal Moisture Map", "Load-Bearing Capacity Assessment"],
      },
      {
        number: "02",
        title: "Architectural Redesign & 3D Walkthrough",
        duration: "Days 6 - 15",
        desc: "Re-imagining your space with open-concept floor plans, modern exterior façade treatments, energy-efficient window placements, and full photorealistic 3D interior renders.",
        deliverables: ["Modernized Floor Plan", "3D Exterior Façade Design", "3D Interior Renders"],
      },
      {
        number: "03",
        title: "Controlled Demolition & Core Retrofitting",
        duration: "Days 16 - 28",
        desc: "Surgical, non-impact demolition with dust suppression screens. Retrofitting load-bearing beams with ISMB structural steel sections or carbon-fiber reinforced polymers (CFRP).",
        deliverables: ["Structural Retrofit Certificate", "Dust-Containment Protocols", "Debris Clearance Certification"],
      },
      {
        number: "04",
        title: "Complete MEP Replacement & Smart Wiring",
        duration: "Days 29 - 48",
        desc: "Stripping outdated plumbing and electrical. Installing new sound-insulated drainage lines, high-pressure CPVC water networks, and smart home automation conduits.",
        deliverables: ["New MEP Schematics", "Pressure Test Results", "Load Distribution Chart"],
      },
      {
        number: "05",
        title: "Façade Upgrades & Advanced Waterproofing",
        duration: "Days 49 - 70",
        desc: "Modern exterior stone cladding, weather-shield exterior louvers, thermal roof barrier coatings, and new German double-glazed soundproof glass systems.",
        deliverables: ["High-Pressure Water Spray Test", "Façade Anchor Pull Tests", "Roof Thermal Performance Check"],
      },
      {
        number: "06",
        title: "Interior Finishes, Detailing & Turnkey Handover",
        duration: "Days 71 - 90",
        desc: "Designer ceilings, bespoke woodwork, luxury bathroom sanitary ware, deep chemical cleaning, air scrubbing, and turnkey handover backed by warranty certificates.",
        deliverables: ["5-Year Renovation Warranty", "Snag Audit Sign-off", "Operation & Care Guide"],
      },
    ],
    checks: [
      {
        title: "Structural Column Core Strength",
        desc: "NDT ultrasonic pulse velocity & Schmidt rebound hammer testing to verify that existing columns can support new loads.",
        standard: "IS 13311 (Part 1 & 2)",
      },
      {
        title: "Thermal Infrared Seepage Mapping",
        desc: "FLIR thermal imaging to pinpoint concealed pipe fractures, condensation zones, and capillary dampness in existing walls.",
        standard: "100% Moisture Traceability",
      },
      {
        title: "Electrical Load Capacity & Earthing",
        desc: "Auditing transformer and distribution boards to support new modern VRV ACs, EV chargers, and automation systems.",
        standard: "Central Electricity Authority Norms",
      },
      {
        title: "Facade Anchoring Tensile Test",
        desc: "Direct pull-out resistance tests on mechanical anchors used for external stone cladding and metal louvers.",
        standard: "ASTM E488 Anchor Standard",
      },
      {
        title: "Acoustic Decibel Isolation",
        desc: "Sound transmission loss testing across exterior windows and party walls to ensure silence from street traffic.",
        standard: "STC Rating 38+ dB",
      },
      {
        title: "Dust & Neighbor Safeguard Audits",
        desc: "Heavy-duty poly containment barriers and daily HEPA air scrubbing so neighborhood and inhabited floors stay clean.",
        standard: "Green Building Dust Control",
      },
    ],
    usps: [
      {
        title: "Dust & Noise Containment Protocols",
        desc: "We deploy industrial air scrubbers, acoustic barriers, and daily cleanups so neighboring properties are never disturbed.",
        badge: "Clean Work",
      },
      {
        title: "Fixed Timeline with Penalty Guarantee",
        desc: "Detailed Gantt chart schedules backed by a written penalty clause for any unexcused delays in delivery.",
        badge: "On-Time",
      },
      {
        title: "Zero Structural Risk Guarantee",
        desc: "Every wall removal or modification is calculated and signed off by licensed senior structural engineers.",
        badge: "Engineered",
      },
      {
        title: "5-Year Seepage & Renovation Warranty",
        desc: "Complete 5-year guarantee covering all new waterproofing membranes, plumbing joints, and structural additions.",
        badge: "5-Year Warranty",
      },
    ],
    faqs: [
      {
        question: "Can we live on one floor of our villa while the renovation takes place?",
        answer: "Yes. For phased renovations, we isolate the active work zones with temporary sound and dust partitions, maintaining separate access and continuous water/power supply to your living quarters.",
      },
      {
        question: "How do you ensure taking down walls won't weaken our home?",
        answer: "We perform NDT structural audits before touching any wall. If a load-bearing partition is removed, we engineer and insert heavy-gauge ISMB steel girders or reinforced concrete lintels to safely redistribute loads.",
      },
      {
        question: "Can an older 15-year-old villa in DLF be retrofitted for modern central VRV air conditioning?",
        answer: "Yes. We specialize in routing concealed high-efficiency VRV/VRF ducting through customized architectural ceiling drops without sacrificing room heights.",
      },
    ],
    consultationCTA: {
      title: "Book a Villa Renovation Consultation",
      description: "Schedule an on-site structural audit and design evaluation for your existing Gurgaon property.",
      buttonText: "Book Renovation Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Property Renovation in Gurgaon.",
    },
  },
  {
    id: "commercial-construction",
    slug: "commercial-construction",
    aliases: ["commercial", "office-construction"],
    title: "Commercial & Corporate Construction",
    shortTitle: "Commercial Construction",
    tagline: "Grade-A office towers, retail complexes, and commercial facilities built for high rental yields and modern business.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
    iconName: "Building2",
    projectTypeFilter: "commercial",
    overview: "From corporate headquarters on Golf Course Extension Road to modern retail plazas in Sector 71, Rupali Construction builds commercial assets optimized for maximum carpet area efficiency, high-volume footfall, and green building environmental standards.",
    highlights: [
      { label: "Commercial Assets", value: "40+ Projects" },
      { label: "Floor Load Design", value: "Up to 10 kN/m²" },
      { label: "Building Code", value: "NBC 2016 Compliant" },
      { label: "Speed Execution", value: "PEB / Post-Tensioned" },
    ],
    steps: [
      {
        number: "01",
        title: "Commercial Feasibility & FAR Maximization",
        duration: "Month 1",
        desc: "Comprehensive analysis of Floor Area Ratio (FAR), commercial zoning clearances, traffic circulation planning, and statutory fire setbacks.",
        deliverables: ["FAR Optimization Study", "Traffic Impact Analysis", "Authority Sanction Drawings"],
      },
      {
        number: "02",
        title: "Integrated MEPF & High-Span Structural Modeling",
        duration: "Month 2",
        desc: "Post-tensioned (PT) slab design for wide column-free office layouts, centralized HVAC heat load calculations, diesel generator backups, and building management system (BMS) schematics.",
        deliverables: ["PT Slab Structural Drawings", "Fire Hydrant & Sprinkler Design", "Central HVAC Ducting Routing"],
      },
      {
        number: "03",
        title: "Basement Excavation & Diaphragm Wall",
        duration: "Months 3 - 5",
        desc: "Deep multi-level basement excavation with soil nailing, soldier piles, and continuous dewatering systems ensuring zero settlement to adjoining structures.",
        deliverables: ["Inclinometer Settlement Reports", "Deep Foundation Pile Integrity Tests", "Waterproofing Certificates"],
      },
      {
        number: "04",
        title: "High-Strength Superstructure Erection",
        duration: "Months 6 - 10",
        desc: "Rapid-cycle construction using M35/M40 high-performance concrete, mechanized slip-form work for elevator cores, and post-tensioned cable tensioning.",
        deliverables: ["PT Cable Elongation Reports", "Ultrasonic Concrete Testing", "Core Plumb Survey"],
      },
      {
        number: "05",
        title: "Unitized Glass Curtain Wall & Façade",
        duration: "Months 11 - 13",
        desc: "Acoustic double-glazed unitized glass façade with solar-control low-E coatings, engineered for high-velocity monsoon wind loads.",
        deliverables: ["Glass Wind Load Test Certs", "Acoustic Decibel Rating Sign-off", "Thermal Solar Heat Coefficient"],
      },
      {
        number: "06",
        title: "Fit-Out Coordination, Fire NOC & Handover",
        duration: "Months 14 - 16",
        desc: "Integrated testing of life-safety systems, high-speed elevator commissioning, Fire Department NOC clearance, and building handover.",
        deliverables: ["Fire Department NOC", "Building Occupancy Certificate", "Complete As-Built MEPF Manuals"],
      },
    ],
    checks: [
      {
        title: "Live Load & Dynamic Vibration Analysis",
        desc: "Verifying slab deflection and floor harmonic resonance for heavy office machinery and dense occupancy.",
        standard: "IS 875 (Part 2) Heavy Commercial",
      },
      {
        title: "Fire Safety & Evacuation Compliance",
        desc: "2-hour fire-rated stairwell pressurization, automatic sprinkler density, and emergency smoke extraction ducts.",
        standard: "NBC 2016 Part 4 Fire Safety",
      },
      {
        title: "Curtain Wall Structural Sealant Adhesion",
        desc: "Deglazing tests and mock-up chamber wind-driven rain testing to guarantee zero leaks in glass façades.",
        standard: "ASTM C1401 Glazing Code",
      },
      {
        title: "Electrical Earth Resistance & Power Quality",
        desc: "Testing dedicated earthing pits (<1 ohm) and total harmonic distortion (THD) for sensitive IT/data server rooms.",
        standard: "IEEE 142 Earthing Standard",
      },
      {
        title: "Elevator Shaft Plumbness & Buffer Checks",
        desc: "Laser alignment of elevator guide rails to ensure ultra-smooth ride quality with zero lateral vibration.",
        standard: "IS 14665 Elevator Norms",
      },
      {
        title: "Energy Conservation Building Code (ECBC)",
        desc: "Wall thermal transmittance (U-value) and lighting power density verification for lower operational air-conditioning bills.",
        standard: "ECBC Level 2 Compliance",
      },
    ],
    usps: [
      {
        title: "Column-Free Span Optimization",
        desc: "Post-tensioned engineering enables spans up to 12 meters, giving tenants maximum usable carpet area and interior layout flexibility.",
        badge: "Higher Rent",
      },
      {
        title: "Fast-Track Hybrid / PEB Capability",
        desc: "Optional composite steel construction that cuts total build time by up to 40%, speeding up rental income realization.",
        badge: "Speed Build",
      },
      {
        title: "Complete Government NOC Handling",
        desc: "Dedicated compliance team handling Haryana Fire Services NOC, pollution clearances, and MCG completion certificates.",
        badge: "Full Approval",
      },
      {
        title: "Institutional Quality Engineering",
        desc: "Built to institutional investment standards, making your commercial building attractive to multinational corporate tenants.",
        badge: "Grade-A",
      },
    ],
    faqs: [
      {
        question: "Can Rupali Construction deliver both core & shell and interior fit-out?",
        answer: "Yes. We offer both Core & Shell construction as well as complete turnkey corporate interior fit-out with acoustic partitioning, HVAC, data cabling, and executive suites.",
      },
      {
        question: "What concrete mix and curing methods do you use for high-rise commercial basements?",
        answer: "We use high-grade M35/M40 concrete with crystalline integral waterproofing admixtures, cured under strict moisture membranes to ensure zero hydrostatic basement leakage.",
      },
      {
        question: "How do you help optimize commercial rental yield?",
        answer: "By designing column-free floor plates with post-tensioned slabs and optimizing core elevator locations, we increase leasable super-area efficiency to above 82%.",
      },
    ],
    consultationCTA: {
      title: "Book a Commercial Construction Strategy Call",
      description: "Consult with our commercial project leads on FAR optimization, estimated build budgets, and timeline models.",
      buttonText: "Book Commercial Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Commercial Construction in Gurgaon.",
    },
  },
  {
    id: "interior-design",
    slug: "interior-design",
    aliases: ["interiors", "luxury-interiors"],
    title: "Turnkey Luxury Interior Design",
    shortTitle: "Interior Design",
    tagline: "Bespoke, high-end residential interiors fusing European craftsmanship, custom Italian woodwork, and smart home automation.",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
    iconName: "Paintbrush",
    projectTypeFilter: "interior",
    overview: "We create immersive luxury interiors for Gurgaon villas and high-end apartments. With our own state-of-the-art German CNC manufacturing unit, we fabricate flawless modular woodwork, custom Italian marble flooring, designer lighting, and tailored soft furnishings with 100% fidelity to the approved 3D renders.",
    highlights: [
      { label: "Interiors Crafted", value: "200+ Projects" },
      { label: "Hardware Warranty", value: "5 Years" },
      { label: "Factory Finish", value: "100% German CNC" },
      { label: "3D Render Accuracy", value: "100% Match" },
    ],
    steps: [
      {
        number: "01",
        title: "Lifestyle Discovery & Material Moodboarding",
        duration: "Days 1 - 7",
        desc: "Personal design interviews understanding how your family lives, material preferences (Italian marble, smoked oak, brass accents), lighting choices, and storage demands.",
        deliverables: ["Personal Design Brief", "Tactile Material Moodboard", "Space Programming Matrix"],
      },
      {
        number: "02",
        title: "Photorealistic 3D Renders & Virtual Walkthrough",
        duration: "Days 8 - 20",
        desc: "Every room is rendered in photorealistic 4K 3D showing exact lighting shadows, furniture textures, wall moldings, and custom modular joinery.",
        deliverables: ["4K Room Renders", "Interactive 3D Walkthrough", "Exact Material Palette Book"],
      },
      {
        number: "03",
        title: "Material Experience & Hardware Locking",
        duration: "Days 21 - 25",
        desc: "Guided tour through our experience center to hand-select actual veneer flitches, book-matched Italian marble slabs, and German soft-close hardware (Blum / Hettich).",
        deliverables: ["Sample Sign-Off Sheet", "Hardware Specification Schedule", "Transparent Itemized BoQ"],
      },
      {
        number: "04",
        title: "German CNC Factory Fabrication",
        duration: "Days 26 - 55",
        desc: "Precision manufacturing in a dust-controlled facility using high-density HDHMR boards, PUR edge-banding, and multi-coat Italian polyurethane (PU) polish.",
        deliverables: ["Factory Quality Inspection Video", "Module Assembly Pre-Check", "Zero On-Site Dust Woodwork"],
      },
      {
        number: "05",
        title: "On-Site Architectural Ceilings & Lighting",
        duration: "Days 35 - 65",
        desc: "Seamless gypsum false ceilings with concealed magnetic track lights, cove illumination, acoustic wall panels, and motorized curtain tracks.",
        deliverables: ["Ceiling Leveling Audit", "Architectural Lux Level Sign-off", "Concealed Conduit As-Built"],
      },
      {
        number: "06",
        title: "Installation, White-Glove Styling & Handover",
        duration: "Days 66 - 80",
        desc: "Modular installation with 1mm laser tolerances, custom designer furniture placement, deep microfiber cleaning, and formal turnkey handover.",
        deliverables: ["5-Year Hardware Warranty Card", "Care & Maintenance Manual", "Key Handover Protocol"],
      },
    ],
    checks: [
      {
        title: "Boiling Waterproof (BWP) Core Verification",
        desc: "100% marine-grade BWP plywood and high-density moisture-resistant (HDHMR) boards for all kitchen and vanity cabinetry.",
        standard: "IS 710 Marine Grade Certified",
      },
      {
        title: "German Soft-Close Mechanism Endurance",
        desc: "Blum & Hettich tandem boxes, hinges, and lift-up systems tested for 200,000 continuous cycle openings without sagging.",
        standard: "DIN EN 15338 Cycle Test",
      },
      {
        title: "Architectural Lux & Color Temperature",
        desc: "Dialux lighting simulation ensuring 300-500 lux in task zones (kitchen/study) and warm 2700K ambient illumination in living areas.",
        standard: "CIE Architectural Lighting Standard",
      },
      {
        title: "Low-VOC Non-Toxic PU Finishes",
        desc: "Italian Milesi/Sayerlack polyurethane polishes with low chemical emissions, ensuring safe indoor air quality for children.",
        standard: "European EN 71-3 Safety Norm",
      },
      {
        title: "Laser 1mm Gap Calibration",
        desc: "All shutter lines, shadow grooves, and marble book-match veins are checked with digital calipers for uniform 1mm gaps.",
        standard: "1mm Precision Tolerance",
      },
      {
        title: "Marble Anti-Stain Nano Sealing",
        desc: "Italian marble treated with multi-coat penetrating nano-sealers to prevent turmeric, wine, or oil stains.",
        standard: "15-Year Stain Resistance",
      },
    ],
    usps: [
      {
        title: "100% 3D Render-to-Reality Match",
        desc: "We guarantee that your finished home will match the approved 3D renders down to the exact millimeter and texture.",
        badge: "Render Match",
      },
      {
        title: "German Factory-Made Joinery",
        desc: "80% of woodwork is manufactured in our precision CNC facility, ensuring dust-free homes and razor-sharp edge banding.",
        badge: "Zero Dust",
      },
      {
        title: "5-Year Comprehensive Warranty",
        desc: "Complete 5-year warranty on all modular cabinetry, hardware hinges, drawer runners, and false ceiling integrity.",
        badge: "5-Year Cover",
      },
      {
        title: "Turnkey Convenience: Concept to Curtains",
        desc: "From structural false ceilings down to custom sofas, rugs, art procurement, and lighting control—we handle it all.",
        badge: "Full Turnkey",
      },
    ],
    faqs: [
      {
        question: "How is Rupali Construction different from freelance interior designers?",
        answer: "Freelancers rely on fragmented third-party carpenters with frequent cost escalations. We own our German CNC manufacturing facility and employ permanent in-house architects, guaranteeing fixed costs and factory-grade finishes.",
      },
      {
        question: "Can you integrate smart home automation with the interior design?",
        answer: "Yes. We design and install centralized smart automation for motorized curtains, DALI architectural dimming, HVAC control, and multi-room audio with sleek glass touchpads and phone app control.",
      },
      {
        question: "What is the typical timeline for a complete 4BHK luxury villa interior?",
        answer: "A complete turnkey luxury interior for a 4BHK villa takes 60 to 80 days from 3D sign-off to white-glove handover.",
      },
    ],
    consultationCTA: {
      title: "Book an Interior Design Consultation",
      description: "Meet with our Senior Interior Architect for a complimentary design exploration and material moodboard preview.",
      buttonText: "Book Interior Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Luxury Interior Design in Gurgaon.",
    },
  },
  {
    id: "architectural-design",
    slug: "architectural-design",
    aliases: ["architecture", "architectural-services"],
    title: "Architectural Design & Vastu-Compliant Planning",
    shortTitle: "Architectural Design",
    tagline: "Sculpting landmark contemporary residences with biophilic light, natural ventilation, and Vastu directional harmony.",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
    iconName: "Compass",
    projectTypeFilter: "residential",
    overview: "Our architectural studio blends striking contemporary forms with climate-responsive Gurgaon orientations and classical Vastu Shastra principles. Every blueprint is engineered to maximize natural daylight, minimize solar heat gain, and create dramatic double-height living spaces.",
    highlights: [
      { label: "Master Blueprints", value: "250+ Designed" },
      { label: "Vastu Compliance", value: "100% Certified" },
      { label: "DTCP Sanction Help", value: "Complete Support" },
      { label: "Natural Light Ratio", value: ">65% Usable" },
    ],
    steps: [
      {
        number: "01",
        title: "Site Microclimate & Sun Path Simulation",
        duration: "Days 1 - 7",
        desc: "Analyzing geographical orientation, summer/winter solar angles, prevailing winds, and Vastu energy vectors (Ishanya, Agneya, Nairutya, Vayavya).",
        deliverables: ["Solar Shadow Simulation", "Wind Flow Analysis", "Vastu Axis Layout"],
      },
      {
        number: "02",
        title: "Spatial Zoning & 2D Floor Plan Options",
        duration: "Days 8 - 20",
        desc: "Drafting optimized floor layouts balancing formal guest spaces, private family sanctuaries, open kitchens, and landscaped courtyard connections.",
        deliverables: ["3 Distinct 2D Layout Options", "Circulation Flow Chart", "Carpet-to-Built-up Optimization"],
      },
      {
        number: "03",
        title: "3D Architectural Massing & Exterior Elevation",
        duration: "Days 21 - 35",
        desc: "Crafting modern geometric façades with cantilevers, wooden louvers, natural stone cladding, and floor-to-ceiling glass in 4K photorealistic renders.",
        deliverables: ["Day & Night 3D Elevation Views", "Material Texture Specification", "Elevation Detail Drawings"],
      },
      {
        number: "04",
        title: "Structural & MEP Space Coordination",
        duration: "Days 36 - 50",
        desc: "Coordinating column grids with structural engineers to prevent unsightly column projections inside rooms, while integrating concealed HVAC drop ceilings.",
        deliverables: ["Integrated Structural-Architectural Grid", "Concealed MEP Service Shafts", "BIM Conflict Resolution"],
      },
      {
        number: "05",
        title: "Municipal Sanction Drawings & Approvals",
        duration: "Days 51 - 65",
        desc: "Preparing official drawings conforming to Haryana Building Code (HSVP / DTCP / MCG) for setback approvals, ground coverage, and basement permissions.",
        deliverables: ["Official Sanction Set", "FAR Calculation Sheets", "Authority Submission Liaison"],
      },
      {
        number: "06",
        title: "70+ Detailed Execution Sheets & Site Supervision",
        duration: "Throughout Build",
        desc: "Providing contractors with millimeter-precise working drawings for stone cladding, window fenestration, staircases, and weekly on-site architect supervision.",
        deliverables: ["70+ Working Construction Drawings", "Weekly Architect Site Log", "Handover As-Built Blueprints"],
      },
    ],
    checks: [
      {
        title: "Vastu Shastra Alignment Verification",
        desc: "Rigorous verification of master bedroom in Nairutya (SW), kitchen in Agneya (SE), entrance in auspicious North/NE zones.",
        standard: "Authentic Vedic Vastu Compliance",
      },
      {
        title: "Sun Path & Shading Coefficient",
        desc: "Using solar simulations to design deep cantilever overhangs that block harsh western summer heat while allowing warm winter light.",
        standard: "ECBC Passive Thermal Standard",
      },
      {
        title: "Haryana Building Code Setbacks",
        desc: "Strict adherence to mandatory front, rear, and side setbacks to ensure 100% legal compliance and zero demolition notices.",
        standard: "Haryana Bye-Laws 2017 & Updates",
      },
      {
        title: "Natural Cross-Ventilation Corridors",
        desc: "Strategic window placement creating positive and negative pressure zones for continuous fresh airflow across rooms.",
        standard: "ASHRAE 62.1 Indoor Air Quality",
      },
      {
        title: "Column Projection Elimination",
        desc: "Columns designed to hide flush inside 9-inch perimeter walls, ensuring no awkward column corners intrude into living spaces.",
        standard: "Flush Architectural Detailing",
      },
      {
        title: "Rainwater Harvesting & Drainage Slope",
        desc: "Roof slope and filtration pit design calculating monsoon rain volume for eco-friendly groundwater recharging.",
        standard: "CGWA Groundwater Standards",
      },
    ],
    usps: [
      {
        title: "Integrated Design-Build Expertise",
        desc: "Unlike standalone architects whose designs prove too expensive or impractical to build, our architects engineer with real-world construction precision.",
        badge: "Zero Conflicts",
      },
      {
        title: "100% Vastu Compliance Guaranteed",
        desc: "We blend cutting-edge modern aesthetics with strict Vastu principles without compromising on dramatic contemporary architecture.",
        badge: "Vastu Harmony",
      },
      {
        title: "Comprehensive 70+ Working Drawing Set",
        desc: "Over 70 detailed construction drawings covering every tile joint, railing detail, and plumbing junction to eliminate site guesswork.",
        badge: "Zero Guesswork",
      },
      {
        title: "Weekly On-Site Principal Architect Audits",
        desc: "Our architects personally visit the site every week during construction to verify that the physical structure matches the blueprint.",
        badge: "Active Oversight",
      },
    ],
    faqs: [
      {
        question: "Can you design a modern minimalist villa that is also strictly Vastu compliant?",
        answer: "Yes, this is our signature specialty. We align key functional spaces (kitchen, master suite, staircase, entrance) according to Vastu directional energy while maintaining sleek modern glass, stone, and cantilever aesthetics.",
      },
      {
        question: "Do you provide architectural design if we already have our own construction contractor?",
        answer: "Yes. We offer standalone Architectural & Structural Design packages complete with 3D elevations, working drawing sets, and periodic site inspection visits.",
      },
      {
        question: "How long does the complete architectural design phase take?",
        answer: "The full architectural process—from initial site survey and 2D concepts to final 3D photorealistic elevations and 70+ working sheets—takes 6 to 8 weeks.",
      },
    ],
    consultationCTA: {
      title: "Book an Architectural Concept Session",
      description: "Consult with our Principal Architect to explore elevation concepts and floor plan ideas for your plot.",
      buttonText: "Book Architecture Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Architectural Design in Gurgaon.",
    },
  },
  {
    id: "structural-engineering",
    slug: "structural-engineering",
    aliases: ["structural", "structural-audits", "engineering"],
    title: "Advanced Structural Engineering & Health Audits",
    shortTitle: "Structural Engineering",
    tagline: "Rigorous mathematical modeling, Seismic Zone IV safety compliance, and certified non-destructive structural audits.",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80",
    iconName: "HardHat",
    projectTypeFilter: "residential",
    overview: "We provide high-precision structural analysis and engineering for luxury residences, commercial complexes, and older buildings requiring stability certification. Our certified structural engineers use STAAD.Pro and ETABS to design earthquake-resilient structures while optimizing steel tonnage.",
    highlights: [
      { label: "Certifications Issued", value: "300+ Buildings" },
      { label: "Seismic Safety", value: "Zone IV Certified" },
      { label: "Steel Optimization", value: "10-15% Savings" },
      { label: "NDT Turnaround", value: "Within 48 Hours" },
    ],
    steps: [
      {
        number: "01",
        title: "Soil Mechanics & Geotechnical Testing",
        duration: "Days 1 - 7",
        desc: "Drilling boreholes to 15-meter depths, Standard Penetration Tests (SPT), chemical analysis of groundwater for sulfate attack risk, and calculating safe bearing capacity (SBC).",
        deliverables: ["Geotechnical Soil Investigation", "Safe Bearing Capacity (SBC) Graph", "Foundation Recommendation"],
      },
      {
        number: "02",
        title: "3D Finite-Element Modeling (ETABS & STAAD.Pro)",
        duration: "Days 8 - 20",
        desc: "Creating 3D finite-element mathematical models simulating dead loads, live loads, monsoon wind shear (47 m/s), and Seismic Zone IV ground acceleration.",
        deliverables: ["3D Finite Element Analysis", "Seismic Shear Distribution", "Torsional Irregularity Checks"],
      },
      {
        number: "03",
        title: "Reinforced Concrete & Steel Detailing",
        duration: "Days 21 - 30",
        desc: "Designing high-ductility rebar detailing complying with IS 13920. Generating bar bending schedules (BBS) to minimize site cutting waste.",
        deliverables: ["Column & Beam Reinforcement Sheets", "Foundation Raft Layout", "Bar Bending Schedules (BBS)"],
      },
      {
        number: "04",
        title: "Non-Destructive Testing (NDT) Audits",
        duration: "On Request (48h)",
        desc: "For existing villas: Ultrasonic Pulse Velocity (UPV), Schmidt rebound hammer testing, rebar cover depth scanning, and concrete carbonation testing.",
        deliverables: ["NDT Structural Health Certificate", "Residual Life Estimate", "Distress Mapping"],
      },
      {
        number: "05",
        title: "Structural Retrofit & Strengthening Plans",
        duration: "As Needed",
        desc: "Designing column carbon-fiber wrapping (CFRP), steel jacketing, and foundation underpinning for buildings adding additional floors or showing foundation settlement.",
        deliverables: ["CFRP Engineering Layout", "Jacketing Anchor Specifications", "Load Transfer Plan"],
      },
      {
        number: "06",
        title: "Mandatory Pre-Pour Slab Inspections & Certification",
        duration: "Throughout Build",
        desc: "Our structural engineer personally inspects rebar diameter, spacing, lap lengths, and cover blocks before every single slab pour and issues formal Stability Certificates.",
        deliverables: ["Pre-Pour Steel Inspection Checklists", "Formal Structural Stability Certificate", "As-Built Structural Drawing File"],
      },
    ],
    checks: [
      {
        title: "IS 1893:2016 Seismic Zone IV Compliance",
        desc: "Ensuring structural ductility, inter-story drift limits (<0.004 h), and soft-story prevention for Delhi-NCR seismic tremors.",
        standard: "IS 1893 (Criteria for Earthquake Design)",
      },
      {
        title: "Rebar Cover Block Depth Scanning",
        desc: "Using electromagnetic cover meters to verify 25mm to 50mm clear concrete cover, shielding rebar from atmospheric moisture corrosion.",
        standard: "IS 456 Durability Norms",
      },
      {
        title: "Ultrasonic Pulse Velocity (UPV) Integrity",
        desc: "Sound wave transmission through concrete to detect internal honeycombing, void spaces, or invisible stress fractures.",
        standard: "IS 13311 (Part 1)",
      },
      {
        title: "Soil Plate Load & Settlement Limit",
        desc: "Verifying that calculated foundation settlement remains strictly within the permissible limit of 25mm to prevent differential cracking.",
        standard: "IS 1888 Plate Load Method",
      },
      {
        title: "Rebar Tensile Elongation & Bend Tests",
        desc: "Independent laboratory verification of yield strength (>550 N/mm²) and percentage elongation to guarantee rebar ductility.",
        standard: "IS 1786 Mechanical Testing",
      },
      {
        title: "Wind Shear Stress at 47 m/s Velocity",
        desc: "Aerodynamic wind pressure calculations ensuring stability against high-speed dust storms and thunderstorm gusts in Haryana.",
        standard: "IS 875 (Part 3) Wind Loads",
      },
    ],
    usps: [
      {
        title: "Haryana Government Licensed Structural Engineers",
        desc: "Certified Chartered Engineers authorized to issue structural stability certificates recognized by DTCP, MCG, and Town Planning bodies.",
        badge: "Govt Certified",
      },
      {
        title: "10-15% Steel Savings with Optimized FEA",
        desc: "Advanced 3D modeling eliminates redundant over-design, saving substantial construction costs while increasing structural resilience.",
        badge: "Cost Smart",
      },
      {
        title: "Rapid 48-Hour NDT Health Audits",
        desc: "Emergency structural inspection for older homes, cracks, or pending property sales with comprehensive diagnostic reports in 48 hours.",
        badge: "Fast 48h Audit",
      },
      {
        title: "Zero Slab Pour Without Physical Sign-Off",
        desc: "Strict protocol: No concrete mixer runs on our sites until our structural engineer personally signs the rebar inspection checklist.",
        badge: "Strict Protocol",
      },
    ],
    faqs: [
      {
        question: "Can our existing 2-story villa support an additional floor safely?",
        answer: "We carry out an NDT structural audit (rebound hammer and column scan) to determine the exact load-bearing margin. If required, we engineer localized column jacketing so the new floor is 100% safe and approved.",
      },
      {
        question: "Do you issue official Structural Stability Certificates for municipal approvals?",
        answer: "Yes, our licensed structural engineers issue certified stability certificates and Form B/C submissions required for building sanctions and occupancy certificates (OC) in Haryana.",
      },
      {
        question: "What is the difference between RCC design and seismic-ductile design?",
        answer: "Standard RCC only supports vertical gravity loads. Seismic ductile design (IS 13920) incorporates specialized column confinement rings and beam-column joint ties that absorb horizontal earthquake shocks without collapsing.",
      },
    ],
    consultationCTA: {
      title: "Book a Structural Engineering Consultation",
      description: "Speak with a licensed Chartered Structural Engineer for blueprints, soil test review, or structural health audits.",
      buttonText: "Book Engineering Consultation",
      whatsappMessage: "Hello Rupali Construction, I would like to book a consultancy for Structural Engineering in Gurgaon.",
    },
  },
];

export function getServiceBySlug(slug: string): ServiceDetailItem | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return servicesData.find(
    (s) => s.slug === cleanSlug || s.id === cleanSlug || (s.aliases && s.aliases.includes(cleanSlug))
  );
}
