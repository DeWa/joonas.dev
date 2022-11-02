module.exports = (col) => {
  const notes = require('./notes')(col);
  let data = {};

  notes.forEach((note) => {
    const category = note.data.category;

    data = {
      ...data,
      [category]: [...(data[category] || []), note],
    };
  });

  return data;
};
