import manifest from './responsive-image-manifest.json';

type OptimizedImage = {
  width: number;
  height: number;
  bytes: number;
  variants: { src: string; width: number; bytes: number }[];
};
const images: Record<string, OptimizedImage> = manifest;

// Exact URL matching leaves new admin uploads and unrelated images untouched.
export function getResponsiveImage(src?: string) {
  const image = src ? images[src] : undefined;
  if (!image) return undefined;
  return {
    width: image.width,
    height: image.height,
    src: image.variants[image.variants.length - 1].src,
    srcSet: image.variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
  };
}
