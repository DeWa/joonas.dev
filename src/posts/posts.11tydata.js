module.exports = {
  eleventyComputed: {
    coverPath: (data) => {
      if (data.cover) {
        return `./src${data.page.url}${data.cover}`;
      } else {
        return '';
      }
    },
  },
};
