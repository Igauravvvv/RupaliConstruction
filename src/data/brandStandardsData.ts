import {
  Landmark,
  Zap,
  Paintbrush,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Brand {
  name: string;
  image?: string;
  description: string;
  confirmed: boolean;
  keyBenefits?: string[];
}

export interface SubCategory {
  name: string;
  brands: Brand[];
}

export interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  subcategories: SubCategory[];
  description: string;
}

export const categories: Category[] = [
  // ───────────────────── STRUCTURAL ─────────────────────
  {
    name: "Structural",
    icon: Landmark,
    color: "#0A1D3A", // Image UI Blue
    description: "High-strength materials that build the foundation of trust.",
    subcategories: [
      {
        name: "Cement",
        brands: [
          {
            name: "UltraTech",
            image: "/assets/brand-standards/structural/ultratech.webp",
            description: "The Engineer's Choice. Engineered for unparalleled compressive strength and consistency.",
            confirmed: true,
            keyBenefits: ["High Strength", "Durability", "Sustainability"],
          },
          {
            name: "Ambuja Cement",
            image: "/assets/brand-standards/structural/shree-cement.webp", // placeholder
            description: "Giant compressive strength for heavy-duty foundations and columns.",
            confirmed: true,
            keyBenefits: ["Rapid Hardening", "Corrosion Resistant", "Eco-friendly"],
          },
          {
            name: "ACC Cement",
            image: "/assets/brand-standards/structural/shree-cement.webp", // placeholder
            description: "Pioneers in cement technology with high-performance blended cements.",
            confirmed: true,
            keyBenefits: ["Low Heat of Hydration", "Crack Resistant", "Smooth Finish"],
          },
          {
            name: "Shree Cement",
            image: "/assets/brand-standards/structural/shree-cement.webp",
            description: "Premium-grade clinker quality delivering exceptional durability.",
            confirmed: true,
            keyBenefits: ["Consistent Quality", "High Workability", "Weather Proof"],
          },
        ],
      },
      {
        name: "Steel",
        brands: [
          {
            name: "Tata Tiscon",
            image: "/assets/brand-standards/structural/tata-steel.webp",
            description: "Industry-leading seismic resistant TMT rebars.",
            confirmed: true,
            keyBenefits: ["Earthquake Resistant", "High Bendability", "Corrosion Resistant"],
          },
        ],
      },
      {
        name: "Bricks",
        brands: [
          {
            name: "AAC Blocks",
            image: "/assets/brand-standards/structural/aac-blocks.webp",
            description: "Advanced lightweight cellular concrete.",
            confirmed: true,
            keyBenefits: ["Thermal Insulation", "Lightweight", "Fire Resistant"],
          },
        ],
      },
      {
        name: "Waterproofing",
        brands: [
          {
            name: "Dr. Fixit",
            image: "/assets/brand-standards/structural/liquid-waterproofing.webp",
            description: "Comprehensive waterproofing solutions for all surfaces.",
            confirmed: true,
            keyBenefits: ["Seamless Membrane", "UV Resistant", "High Elasticity"],
          },
        ],
      },
    ],
  },

  // ───────────────────── MEP ─────────────────────
  {
    name: "MEP",
    icon: Zap,
    color: "#FF6A00", // Image UI Orange
    description: "Advanced systems for seamless and efficient performance.",
    subcategories: [
      {
        name: "Electrical",
        brands: [
          {
            name: "Havells",
            image: "/assets/brand-standards/mep/havells-switches.webp",
            description: "Flame-retardant modular switchgear combining safety and aesthetics.",
            confirmed: true,
            keyBenefits: ["Flame Retardant", "Shock Proof", "Elegant Design"],
          },
          {
            name: "Schneider Electric",
            image: "/assets/brand-standards/mep/schneider.webp",
            description: "Global leaders in premium home automation.",
            confirmed: true,
            keyBenefits: ["Smart Home Ready", "Energy Efficient", "Global Standards"],
          },
          {
            name: "Legrand",
            image: "/assets/brand-standards/mep/havells-switches.webp",
            description: "Premium wiring devices and power distribution.",
            confirmed: true,
            keyBenefits: ["Antibacterial Options", "Modular", "Highly Reliable"],
          },
        ],
      },
      {
        name: "Plumbing",
        brands: [
          {
            name: "Finolex Pipes",
            image: "/assets/brand-standards/mep/finolex-pipes.webp",
            description: "High-pressure plumbing solutions guaranteeing superior joint integrity.",
            confirmed: true,
            keyBenefits: ["Lead Free", "High Flow Rate", "50+ Year Life"],
          },
          {
            name: "Astral",
            image: "/assets/brand-standards/mep/finolex-pipes.webp", // placeholder
            description: "Pioneers of CPVC piping systems in India.",
            confirmed: true,
            keyBenefits: ["Hot & Cold Water", "Bio-film Resistant", "High Impact Strength"],
          },
        ],
      },
      {
        name: "Bath Fittings",
        brands: [
          {
            name: "Jaquar",
            image: "/assets/brand-standards/mep/jaguar-fittings.webp",
            description: "Precision-engineered ceramic disc cartridges delivering a smooth experience.",
            confirmed: true,
            keyBenefits: ["Drip-free Performance", "PVD Finishes", "Water Saving"],
          },
          {
            name: "Kohler",
            image: "/assets/brand-standards/mep/grohe-fittings.webp", // placeholder
            description: "Bold designs with uncompromising functional excellence.",
            confirmed: true,
            keyBenefits: ["Statement Pieces", "Vibrant Finishes", "Lifetime Limited Warranty"],
          },
          {
            name: "Cera",
            image: "/assets/brand-standards/mep/grohe-fittings.webp", // placeholder
            description: "Contemporary bath solutions that blend style and comfort.",
            confirmed: true,
            keyBenefits: ["Easy Maintenance", "Wide Range", "Affordable Luxury"],
          },
        ],
      },
    ],
  },

  // ───────────────────── INTERIOR ─────────────────────
  {
    name: "Interior",
    icon: Paintbrush,
    color: "#2BA745", // Image UI Green
    description: "Premium finishes and materials that define your space.",
    subcategories: [
      {
        name: "Doors & Plywood",
        brands: [
          {
            name: "Century Ply",
            image: "/assets/brand-standards/interior/century-ply.webp",
            description: "Premium BWR-grade flush doors subjected to rigorous termite treatment.",
            confirmed: true,
            keyBenefits: ["Borer & Termite Proof", "Boiling Water Proof", "ViroKill Technology"],
          },
        ],
      },
      {
        name: "Windows",
        brands: [
          {
            name: "Fenesta",
            image: "/assets/brand-standards/interior/fenesta.webp",
            description: "Factory-sealed UPVC systems offering exceptional acoustic insulation.",
            confirmed: true,
            keyBenefits: ["Noise Reduction", "Dust Proof", "Zero Maintenance"],
          },
        ],
      },
      {
        name: "Tiles",
        brands: [
          {
            name: "Kajaria",
            image: "/assets/brand-standards/interior/kajaria.webp",
            description: "Exquisite vitrified surfaces engineered for the Indian climate.",
            confirmed: true,
            keyBenefits: ["Scratch Resistant", "Anti-Skid Options", "Large Formats"],
          },
        ],
      },
    ],
  },

  // ───────────────────── FINISHING ─────────────────────
  {
    name: "Finishing",
    icon: Sparkles,
    color: "#6C5CE7", // Image UI Purple
    description: "The final touch that brings perfection to every detail.",
    subcategories: [
      {
        name: "Paint",
        brands: [
          {
            name: "Asian Paints",
            image: "/assets/brand-standards/finishing/asian-paints.webp",
            description: "Ultra-premium, low-VOC interior emulsions delivering a flawless luxury sheen.",
            confirmed: true,
            keyBenefits: ["Teflon Surface Protector", "Anti-bacterial", "Odourless"],
          },
        ],
      },
      {
        name: "Lighting",
        brands: [
          {
            name: "Syska",
            image: "/assets/brand-standards/finishing/syska-finishing.webp",
            description: "High-CRI smart LED systems providing consistent, flawless color rendering.",
            confirmed: true,
            keyBenefits: ["Energy Efficient", "Flicker Free", "Smart Controls"],
          },
        ],
      },
    ],
  },
];
