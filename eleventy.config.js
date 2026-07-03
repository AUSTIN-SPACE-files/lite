import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp"],
    widths: [400, 800, "auto"],
    urlPath: "/assets/images/optimized/",
    outputDir: "./_site/assets/images/optimized/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(min-width: 800px) 50vw, 100vw",
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}
