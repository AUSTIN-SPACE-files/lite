import Image from "@11ty/eleventy-img";
import { imagePipeline } from "./imagePipeline.js";

const AUSTIN_SPACE_URL = "https://austinspace.co.uk";

// Austin Space's own identity, not client data. It's identical across every
// fleet clone by construction — centralizing it across repos (a shared
// package, or a documented single-file convention) is a cross-repo concern
// this repo can't resolve on its own. Until then, update this same block in
// every clone.
const austinSpaceOrg = {
  "@type": "Organization",
  "@id": `${AUSTIN_SPACE_URL}#org`,
  "name": "Austin Space",
  "legalName": "Charles Austin",
  "url": "", // TODO: Charles to fill in — studio site
  "sameAs": [], // TODO: Charles to fill in — real social/professional profiles
};

const DAY_TO_SCHEMA = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

// Removes keys/entries that are "", null, undefined, or empty arrays/objects,
// so sparser client data never serializes as invalid/empty schema properties.
function prune(value) {
  if (Array.isArray(value)) {
    const arr = value.map(prune).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      const pruned = prune(val);
      if (pruned !== undefined) out[key] = pruned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}

// Resolves the hero image through the same eleventy-img pipeline used
// elsewhere in the build, so the URL is one the build actually publishes.
export async function heroImageUrl(site) {
  if (!site.heroImage) return undefined;
  const metadata = await Image(`./src/assets/images/${site.heroImage}`, {
    widths: ["auto"],
    ...imagePipeline,
  });
  return `${site.url}${metadata.webp[0].url}`;
}

// Called from src/_data/eleventyComputed.js with the already-resolved
// Eleventy data cascade — site/services/reviews/social are read once, by
// Eleventy's own data loader, not re-parsed from disk here.
export function buildStructuredData(data) {
  const { site, services, reviews, social, siteName } = data;

  const businessId = `${site.url}#business`;
  const websiteId = `${site.url}#website`;
  const webpageId = `${site.url}#webpage`;

  const openingHoursSpecification = (site.hours || [])
    .filter((slot) => !slot.closed)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_TO_SCHEMA[slot.day],
      opens: slot.open,
      closes: slot.close,
    }));

  const business = {
    "@type": "CafeOrCoffeeShop",
    "@id": businessId,
    name: siteName,
    description: site.footerBlurb,
    url: site.url,
    telephone: site.phone ? site.phone.replace(/\s+/g, "") : undefined,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.addressLocality,
      postalCode: site.postalCode,
      addressCountry: site.addressCountry,
    },
    geo:
      site.latitude !== undefined && site.longitude !== undefined
        ? {
            "@type": "GeoCoordinates",
            latitude: site.latitude,
            longitude: site.longitude,
          }
        : undefined,
    image: [data.heroImageUrl],
    openingHoursSpecification,
    makesOffer: (services || []).map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.blurb,
      },
    })),
    sameAs: Object.values(social || {}).filter(Boolean),
  };

  // Policy: unverified testimonials are shown on-page as social proof
  // (reviews.njk renders every entry in reviews.json regardless of this
  // flag) but never emitted as Review/AggregateRating structured data.
  // Mark a review verified: true only when it's a genuine, attributable
  // review — this keeps clones clear of Google's guidance against marking
  // up self-reported reviews by default, since seed data ships
  // verified: false.
  const verifiedReviews = (reviews || []).filter((review) => review.verified === true);
  let reviewNodes = [];
  if (verifiedReviews.length) {
    reviewNodes = verifiedReviews.map((review, index) => ({
      "@type": "Review",
      "@id": `${businessId}#review-${index + 1}`,
      itemReviewed: { "@id": businessId },
      author: { "@type": "Person", name: review.name },
      reviewBody: review.quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
    }));

    business.review = reviewNodes.map((node) => ({ "@id": node["@id"] }));
    const average =
      verifiedReviews.reduce((sum, review) => sum + review.rating, 0) / verifiedReviews.length;
    business.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(average * 10) / 10,
      reviewCount: verifiedReviews.length,
      bestRating: 5,
    };
  }

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: siteName,
    publisher: { "@id": businessId },
    creator: { "@id": austinSpaceOrg["@id"] },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: site.url,
    name: siteName + (site.metaTitleSuffix ? ` | ${site.metaTitleSuffix}` : ""),
    description: site.metaDescription,
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    creator: { "@id": austinSpaceOrg["@id"] },
    publisher: { "@id": austinSpaceOrg["@id"] },
  };

  const graph = [business, website, webpage, austinSpaceOrg, ...reviewNodes];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": prune(graph),
  };

  // Escape "<" so client copy containing "</script>" can't break out of the tag.
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
