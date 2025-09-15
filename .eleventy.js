const yaml = require("js-yaml");
const { DateTime } = require("luxon");

const Prism = require('prismjs');
require('prismjs/components/prism-nasm');   // For Assembly (asm)
require('prismjs/components/prism-matlab'); // For MATLAB
require('prismjs/plugins/line-numbers/prism-line-numbers');


module.exports = function(eleventyConfig) {

  // This fix is needed to handle the date format in the front matter.
  // By default Eleventy gets pissy if the date doesn't have a yyyy-mm-dd format.
  // This fix allows for more flexible date formats.
  // See https://github.com/11ty/eleventy/issues/413#event-1217736593
  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      yaml: {
        parse: (str) => {
          const data = yaml.load(str);

          if (data && data.date && typeof data.date === 'string') {
            const parsedDate = new Date(data.date);
            if (!isNaN(parsedDate.getTime())) {
              data.date = parsedDate;
            }
          }
          return data;
        }
      }
    }
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("*.html");

  // Ensure all CSS files are copied
  eleventyConfig.addPassthroughCopy("css/*.css");

  // Site configuration (equivalent to _config.yml)
  // Define the prefix based on the environment
  const pathPrefix = process.env.ELEVENTY_ENV === 'production' ? '/reading_list' : '';
  eleventyConfig.addGlobalData("site", {
    name: "Reading List",
    description: "Allen's reading list",
    url: "http://allenyin.github.io/reading_list",
    baseurl: pathPrefix,
    pathPrefix: pathPrefix,
    github: "allenyin/reading_list",
    // gaaccount: "UA-108068754-1",
    disqus: "",
    comments: false,
    year: new Date().getFullYear()
  });

  // Configure markdown processing with LaTeX support
  const markdownIt = require("markdown-it");
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };

  const md = markdownIt(markdownItOptions);

  // Add syntax highlighting (equivalent to syntax_highlighter: rouge)
  md.use(require("markdown-it-prism"), {
    defaultLanguage: 'text',
    prism: Prism,
    preAttributes: { class: 'line-numbers' }
  });


  // Add LaTeX support (using markdown-it-mathjax3 for better compatibility)
  md.use(require("markdown-it-mathjax3"), {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
  });

  // Enable css attribute syntax for images
  md.use(require("markdown-it-attrs"));


  // Set the markdown library
  eleventyConfig.setLibrary("md", md);


  // Add filter to use in archives.html
  eleventyConfig.addNunjucksFilter("date", function(dateObj, format) {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  // Helper function to extract date from filename if not in front matter
  function extractDateFromFilename(filename) {
    const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      return new Date(dateMatch[1], dateMatch[2] - 1, dateMatch[3]);
    }
    return null;
  }

  // Helper function to generate permalink for a post
  function generatePermalink(post) {
    // Check for existing permalink override
    if (post.data.permalink) {
      return post.data.permalink;
    }

    // Then, create a "clean" slug by removing the date prefix if it exists.
    const cleanSlug = post.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '');

    // Finally build the consistent url
    return `/posts/${cleanSlug}/`;
  }

  // Custom filters for tag processing
  eleventyConfig.addFilter("formatTags", function (tags) {
    if (!tags) return "";
    return tags.map(tag => tag.replace(/_/g, ' ')).join(', ');
  });

  // Filter to get post by slug (for cross-referencing)
  eleventyConfig.addFilter("getPostBySlug", function (slug, posts) {
    return posts.find(post => post.fileSlug === slug);
  });

  // Filter to get post by title (for cross-referencing)
  eleventyConfig.addFilter("getPostByTitle", function (title, posts) {
    return posts.find(post => post.data.title === title);
  });

  // Add a helper function to ensure a date is a number for sorting
  function postDateToNumber(date) {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.getTime();
    }
    return 0; // Fallback for invalid or missing dates
  }

  eleventyConfig.addCollection("posts", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_posts/**/*.md")
      .map(post => {
        // Fallback to filename date if no date in front matter
        if (!(post.data.date instanceof Date) || isNaN(post.data.date.getTime())) {
          const filenameDate = extractDateFromFilename(post.fileSlug);
          if (filenameDate) {
            post.data.date = filenameDate;
          }
        }

        // Generate permalink
        post.data.permalink = generatePermalink(post);

        return post;
      })
      .sort((a, b) => {
        // Use the helper function for a safe, numerical comparison
        const dateA = postDateToNumber(a.data.date);
        const dateB = postDateToNumber(b.data.date);
        return dateB - dateA;
      });

    // Add next/previous navigation
    posts.forEach((post, index) => {
      if (index > 0) {
        post.data.next = posts[index - 1] || null;  
      }
      if (index < posts.length - 1) {
        post.data.previous = posts[index + 1] || null;
      }
    });

    return posts;
  });

  // Collection for all tags
  eleventyConfig.addCollection("tags", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_posts/**/*.md");
    const tags = new Set();

    posts.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  });

  // Collection for posts by tag
  eleventyConfig.addCollection("postsByTag", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_posts/**/*.md");
    const postsByTag = {};

    posts.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          if (!postsByTag[tag]) {
            postsByTag[tag] = [];
          }
          postsByTag[tag].push(post);
        });
      }
    });

    return postsByTag;
  });

  // Add a filter to ensure line numbers are applied
  eleventyConfig.addFilter("addLineNumbers", function(content) {
    return content.replace(/<pre class="language-([^"]+)">/g, '<pre class="language-$1 line-numbers">');
  });

  // Ignore files (equivalent to exclude)
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("LICENSE");
  eleventyConfig.ignores.add("jekyll_to_11ty_migration.md");
  eleventyConfig.ignores.add("POST_MIGRATION_TODO.md");
  eleventyConfig.ignores.add(".eleventy.js");

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",  // This specifies the project's root folder as the main source for all pages built.
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
