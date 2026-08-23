import { getDb } from "./server/queries/connection";
import { testimonials } from "./db/schema";
import { fallbackTestimonials } from "./src/sections/Testimonials";

async function seedTestimonials() {
  try {
    const db = getDb();
    console.log("Seeding fallback testimonials to Supabase...");

    for (const t of fallbackTestimonials) {
      await db.insert(testimonials).values({
        name: t.name,
        location: t.location,
        rating: t.rating,
        content: t.content,
        featured: true,
      });
      console.log(`Seeded testimonial from: ${t.name}`);
    }

    console.log("Testimonials seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Could not seed testimonials:", error);
    process.exit(1);
  }
}

seedTestimonials();
