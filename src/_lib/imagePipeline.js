// Shared @11ty/eleventy-img output config, read by both eleventy.config.js's
// shortcode/transform-plugin registrations and _lib/structuredData.js's
// heroImageUrl(), so the rendered asset and the JSON-LD image URL can't drift.
// `widths` is intentionally left per-call-site: it legitimately differs
// (["auto"] for single large images vs [400, 800, "auto"] for the responsive
// HTML transform).
export const imagePipeline = {
  formats: ["webp"],
  urlPath: "/assets/images/optimized/",
  outputDir: "./_site/assets/images/optimized/",
};
