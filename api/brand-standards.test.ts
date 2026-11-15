import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { categories } from "../src/data/brandStandardsData";

describe("material library", () => {
  it("keeps every category, material, brand and product image available locally", () => {
    const images = categories.flatMap(category => [
      category.image,
      ...category.subcategories.flatMap(material => [
        material.image!,
        ...material.brands.flatMap(brand => [
          brand.image!,
          ...(brand.products ?? []).map(product => product.image),
        ]),
      ]),
    ]);
    for (const image of images) {
      expect(image.startsWith("/"), image).toBe(true);
      expect(existsSync(`public${image}`), image).toBe(true);
      expect(readFileSync(`public${image}`).length, image).toBeGreaterThan(50);
    }
  });
  it("uses the manufacturer product assets for cement instead of unrelated stock photos", () => {
    const cement = categories[0].subcategories.find(
      material => material.name === "Cement"
    )!;
    expect(cement.image).toBe("/images/material-library/ultratech-opc.webp");
    expect(cement.brands[0].products?.[1].image).toBe(
      "/images/material-library/ultratech-ppc.webp"
    );
    expect(cement.brands[1].image).toBe(
      "/images/material-library/shree-cement-bags.webp"
    );
  });
  it("uses the correct Daikin manufacturer website", () => {
    const brand = categories
      .flatMap(category =>
        category.subcategories.flatMap(material => material.brands)
      )
      .find(brand => brand.name === "Daikin");
    expect(brand?.website).toBe("https://www.daikinindia.com");
  });
});
