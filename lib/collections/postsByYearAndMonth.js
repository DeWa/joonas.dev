const siteData = require('../../src/_data/metadata');

module.exports = (col) => {
  let posts = require('./posts')(col);
  let data = {};

  posts = posts.sort((a, b) => b.date.getFullYear() - a.date.getFullYear());

  posts.forEach((post) => {
    const year = post.date.getFullYear();
    const month = post.date.toLocaleString('en-GB', { month: 'long' });

    data = {
      ...data,
      [year]: {
        ...data[year],
        [month]:
          data[year] && data[year][month]
            ? [...data[year][month], post]
            : [post],
      },
    };
  });

  return data;
};
