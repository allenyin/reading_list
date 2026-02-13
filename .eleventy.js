require("dotenv").config();
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
    comments: true,
    cusdis_app_id: process.env.CUSDIS_APP_ID || "",
    year: new Date().getFullYear()
  });

  eleventyConfig.addGlobalData("analytics", {
    isProduction: process.env.ELEVENTY_ENV === 'production',
    ga_id: process.env.GA_ID || ""
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

  // Add anchor links to headers for TOC navigation
  md.use(require("markdown-it-anchor"), {
    permalink: false, // Don't add permalink icons
    slugify: (s) => {
      // Custom slugify function to match common conventions
      return s.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple dashes with single dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
    }
  });

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

    // Use the actual file structure: /_posts/filename/
    return `/_posts/${post.fileSlug}/`;
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

  // Filter to extract table of contents from markdown content (only h1 and h2)
  eleventyConfig.addFilter("getTOC", function(content) {
    if (!content) return "";
    
    // Match only h1 and h2 headers with their IDs (may have tabindex attribute)
    const headerRegex = /<h([12])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[12]>/g;
    const headers = [];
    let match;
    
    while ((match = headerRegex.exec(content)) !== null) {
      headers.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3]
      });
    }
    
    if (headers.length === 0) return "";
    
    // Generate TOC HTML (simplified for only 2 levels)
    let toc = '<nav class="table-of-contents">\n<ul>\n';
    let currentLevel = 0;
    
    headers.forEach(header => {
      const level = header.level;
      
      // If moving from h1 to h2, start a nested list
      if (level === 2 && currentLevel === 1) {
        toc += '<ul>\n';
      }
      // If moving from h2 to h1, close the nested list
      else if (level === 1 && currentLevel === 2) {
        toc += '</ul>\n</li>\n';
      }
      // Same level, close previous item
      else if (currentLevel > 0) {
        toc += '</li>\n';
      }
      
      toc += `<li><a href="#${header.id}">${header.text}</a>`;
      currentLevel = level;
    });
    
    // Close all remaining list items
    if (currentLevel === 2) {
      toc += '</li>\n</ul>\n</li>\n</ul>\n';
    } else if (currentLevel === 1) {
      toc += '</li>\n</ul>\n';
    }
    
    toc += '</nav>';
    return toc;
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
    pathPrefix: pathPrefix,
    dir: {
      input: ".",  // This specifies the project's root folder as the main source for all pages built.
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
