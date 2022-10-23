/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{njk,md}', './src/**/*.svg'],
  theme: {
    fontFamily: {
      header: ['Montserrat', 'ui-sans-serif', 'sans'],
      body: ['Quattrocento', 'system-ui', 'sans-serif'],
      logo: ['Permanent Marker', 'cursive', 'sans-serif'],
    },
    extend: {
      colors: {
        transparent: 'transparent',
        darkestBlue: 'rgba(0, 19, 74, 1)',
        darkestPink: 'rgba(35, 3, 41, 1) ',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
