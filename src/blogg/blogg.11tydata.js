// Standardvärden för alla inlägg i den här mappen.
// Inlägg markerade som utkast byggs inte alls (de syns inte på sajten).
export default {
  layout: "layouts/inlagg.njk",
  eleventyComputed: {
    permalink: (d) => {
      return d.utkast ? false : `/blogg/${d.page.fileSlug}/`;
    },
  },
};
