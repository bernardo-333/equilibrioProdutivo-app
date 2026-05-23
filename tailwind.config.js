export default {
  darkMode: 'class',
  content: [
    './index.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'surface-container-highest': '#333333',
        'surface-container-low': '#242424',
        'primary': '#3b82f6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
