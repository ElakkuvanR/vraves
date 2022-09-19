module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/Releasebackground.jpg')",
        'setup': "url('/setup.jpg')",
        'selectproject': "url('/selectproj.jpg')",
      },
  },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}