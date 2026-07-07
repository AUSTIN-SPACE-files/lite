import { buildStructuredData, heroImageUrl } from "../_lib/structuredData.js";
import { resolveGalleryImages } from "../_lib/galleryImages.js";

export default {
  siteName: (data) =>
    [data.site.businessName, data.site.businessDescriptor].filter(Boolean).join(" "),

  pageTitle: (data) =>
    data.siteName + (data.site.metaTitleSuffix ? ` | ${data.site.metaTitleSuffix}` : ""),
  canonicalUrl: (data) => `${data.site.url}${data.page.url}`,
  heroImageUrl: (data) => heroImageUrl(data.site),

  hasGallery: (data) =>
    data.hasGallery === false ? false : Array.isArray(data.gallery) && data.gallery.length > 0,
  needsLightbox: (data) => Boolean(data.hasGallery || data.hasContactForm),
  galleryResolved: (data) => resolveGalleryImages(data.gallery),
  hasReviews: (data) => Array.isArray(data.reviews) && data.reviews.length > 0,
  hasServices: (data) => Array.isArray(data.services) && data.services.length > 0,
  hasHours: (data) => Array.isArray(data.site.hours) && data.site.hours.length > 0,
  hasAddress: (data) => Boolean(data.site.streetAddress && data.site.addressLocality),

  structuredData: (data) => buildStructuredData(data),
};
