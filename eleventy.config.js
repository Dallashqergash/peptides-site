// Eleventy-konfiguration för sajten.
// Inlägg skrivs i Markdown i src/blogg/ (via /admin eller direkt i filerna).

import markdownItAnchor from "markdown-it-anchor";
import { HtmlBasePlugin } from "@11ty/eleventy";

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli",
  "augusti", "september", "oktober", "november", "december"];

function svSlug(s) {
  return String(s || "").toLowerCase()
    .replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/é/g, "e")
    .replace(/&/g, "och").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function (eleventyConfig) {
  // Gör alla länkar rätt när sajten ligger i en undermapp (t.ex. GitHub Pages)
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Rubriker får id (t.ex. ## Källor -> #kallor) så att man kan länka till dem
  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItAnchor, { slugify: svSlug }));

  // Filer som kopieras rakt in i den färdiga sajten
  eleventyConfig.addPassthroughCopy({ "src/bilder": "bilder" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // Alla publicerade blogginlägg, nyast först (utkast visas inte)
  eleventyConfig.addCollection("inlagg", (api) =>
    api.getFilteredByGlob("src/blogg/*.md")
      .filter((p) => !p.data.utkast)
      .sort((a, b) => b.date - a.date));

  // Lista över kategorier som faktiskt används
  eleventyConfig.addCollection("kategorier", (api) => {
    const set = new Set();
    api.getFilteredByGlob("src/blogg/*.md").forEach((p) => {
      if (!p.data.utkast && p.data.kategori) set.add(p.data.kategori);
    });
    return [...set].sort((a, b) => a.localeCompare(b, "sv"));
  });

  // 22 november 2026
  eleventyConfig.addFilter("datum", (d) => {
    const x = new Date(d);
    return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isodatum", (d) => new Date(d).toISOString().slice(0, 10));

  // Ungefärlig lästid i minuter
  eleventyConfig.addFilter("lastid", (content) => {
    const words = String(content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  // URL-vänlig version av en text (för kategorisidor)
  eleventyConfig.addFilter("slug", svSlug);

  eleventyConfig.addFilter("filtrera", (posts, key, val) => (posts || []).filter((p) => p.data[key] === val));
  eleventyConfig.addFilter("utom", (posts, url) => (posts || []).filter((p) => p.url !== url));
  eleventyConfig.addFilter("forsta", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("absolut", (path, base) => String(base || "").replace(/\/$/, "") + (path || "/"));

  // YouTube-länk -> video-id för inbäddning
  eleventyConfig.addFilter("ytid", (url) => {
    const m = String(url || "").match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return m ? m[1] : "";
  });

  // {% youtube "https://youtu.be/..." %} i artiklar
  eleventyConfig.addShortcode("youtube", (url) => {
    const m = String(url || "").match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    if (!m) return "";
    return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="YouTube-video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
