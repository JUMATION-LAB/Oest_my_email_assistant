export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#f4f0fe', 100: '#e9e1fd', 200: '#d5c6fa', 300: '#b9a0f5', 400: '#9b7bf0',
          500: '#7c4dd8', 600: '#6d3fd1', 700: '#5b32b3',
        },
      },
    },
  },
}
