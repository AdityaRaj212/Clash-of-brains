module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4361ee',
          secondary: '#3f37c9',
          accent: '#4895ef',
          dark: '#2b2d42',
          light: '#f8f9fa'
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif']
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }
  