export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        // Gmail red as the main accent (every existing brand-* class picks this up)
        brand: {
          50: '#FCE8E6', 100: '#FAD2CF', 200: '#F6AEA9', 300: '#F28B82',
          400: '#EE675C', 500: '#D93025', 600: '#C5221F', 700: '#B31412',
        },
        // Gmail label pairs: red = brand/errors, yellow = attention, green = success
        gmail: {
          red: '#D93025', redBg: '#FCE8E6', redText: '#C5221F',
          yellow: '#F29900', yellowBg: '#FEF3D6', yellowText: '#B06000',
          green: '#188038', greenBg: '#E6F4EA', greenText: '#137333',
          grayBg: '#F1F3F4', grayText: '#5F6368', charcoal: '#3C4043',
        },
      },
    },
  },
}