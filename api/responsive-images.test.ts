import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import manifest from '../src/lib/responsive-image-manifest.json';
import { getResponsiveImage } from '../src/lib/responsive-images';

describe('responsive project photos', () => {
  it('leaves new uploads, query variants and missing sources unchanged', () => {
    expect(getResponsiveImage()).toBeUndefined();
    expect(getResponsiveImage('https://example.com/new-upload.webp')).toBeUndefined();
    expect(getResponsiveImage(Object.keys(manifest)[0] + '?updated=1')).toBeUndefined();
  });
  it('ships every declared variant with matching dimensions and a versioned cache-safe filename', async () => {
    for (const [source, image] of Object.entries(manifest)) {
      const responsive = getResponsiveImage(source)!;
      expect(responsive.width).toBe(image.width);
      expect(responsive.height).toBe(image.height);
      expect(responsive.srcSet).toContain('480w');
      for (const variant of image.variants) {
        expect(variant.src).toMatch(/-[a-f0-9]{12}-\d+\.webp$/);
        const bytes = readFileSync(`public${variant.src}`);
        expect(bytes.length).toBe(variant.bytes);
        const metadata = await sharp(bytes).metadata();
        expect(metadata.width).toBe(variant.width);
        expect(metadata.width).toBeLessThanOrEqual(image.width);
        expect(metadata.height! / metadata.width!).toBeCloseTo(image.height / image.width, 2);
      }
    }
  });
  it('reduces the combined small-image payload by at least 70 percent', () => {
    const images = Object.values(manifest);
    const original = images.reduce((sum, image) => sum + image.bytes, 0);
    const small = images.reduce((sum, image) => sum + image.variants[0].bytes, 0);
    expect(small / original).toBeLessThan(0.3);
  });
});
