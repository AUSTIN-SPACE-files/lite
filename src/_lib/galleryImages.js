import Image from "@11ty/eleventy-img";
import { imagePipeline } from "./imagePipeline.js";

const GALLERY_DIR = "./src/assets/images/gallery/";

// Resolves each gallery item's full-size lightbox URL through the same
// eleventy-img pipeline used elsewhere in the build (imagePipeline), so the
// href always points at an asset eleventy-img actually writes to disk.
export async function resolveGalleryImages(gallery) {
  if (!Array.isArray(gallery)) return gallery;
  return Promise.all(
    gallery.map(async (item) => {
      const metadata = await Image(GALLERY_DIR + item.image, {
        widths: ["auto"],
        ...imagePipeline,
      });
      return { ...item, largeUrl: metadata.webp[0].url };
    }),
  );
}
