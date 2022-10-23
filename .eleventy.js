const { DateTime } = require('luxon');
const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const Image = require('@11ty/eleventy-img');
const path = require('path');

async function imageShortcodeHTML(src, alt, sizes, cls) {
  const options = {
    urlPath: '/img/',
    outputDir: './src/img',
    widths: [400, 800, 1000],
    formats: ['avif', 'png'],
  };

  Image(src, options);

  let imageAttributes = {
    class: cls || '',
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  let metadata = Image.statsSync(src, options);
  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

async function imageShortCode(src) {
  let metadata = await Image(src, {
    widths: [400, 800, 1280],
    formats: ['avif', 'webp', 'jpg'],
  });
  return metadata;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/fonts');
  eleventyConfig.addPassthroughCopy(
    './src/posts/**/*.{png,gif,jpg,webp,avi,avif,mp4,mp3}'
  );
  eleventyConfig.addPassthroughCopy('./src/img');

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
  eleventyConfig.addLayoutAlias('note', 'layouts/note.njk');

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addNunjucksAsyncShortcode('imageHTML', imageShortcodeHTML);
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortCode);

  // Return the smallest number argument
  eleventyConfig.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1
    );
  }
  eleventyConfig.addFilter('filterTagList', filterTagList);
  eleventyConfig.addFilter('log', (value) => {
    console.log(value);
  });
  eleventyConfig.addCollection('posts', require('./lib/collections/posts'));
  eleventyConfig.addCollection('tagList', require('./lib/collections/tagList'));
  eleventyConfig.addCollection(
    'pagedPostsByTag',
    require('./lib/collections/pagedPostsByTag')
  );

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'direct-link',
      symbol: '#',
      level: [1, 2, 3, 4],
    }),
    slugify: eleventyConfig.getFilter('slug'),
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: 'njk',

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: 'njk',

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: '/',
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: './src',
      output: './dist',
      includes: '_includes',
      data: '_data',
    },
  };
};
