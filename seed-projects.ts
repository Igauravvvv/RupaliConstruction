import { getDb } from "./api/queries/connection";
import { projects } from "./db/schema";
import { fallbackProjects } from "./src/sections/Projects";

async function seedProjects() {
  try {
    const db = getDb();
    console.log("Seeding fallback projects to Supabase...");

    for (const project of fallbackProjects) {
      // Create a URL-friendly slug
      const slug = project.name.toLowerCase().replace(/\s+/g, '-');
      
      await db.insert(projects).values({
        name: project.name,
        slug: slug,
        type: project.type,
        location: project.location,
        area: project.area,
        completionDate: project.completionDate,
        coverImage: project.coverImage,
        description: `This is a beautiful ${project.type} project located in ${project.location}.`,
        status: "completed",
        published: true,
      });
      console.log(`Seeded project: ${project.name}`);
    }

    console.log("Projects seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Could not seed projects:", error);
    process.exit(1);
  }
}

seedProjects();
