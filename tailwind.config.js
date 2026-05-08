export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0b0f19',
          800: '#111827',
          700: '#1f2937',
          card: 'rgba(17, 24, 39, 0.7)',
        },
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe'
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0b0f19 0%, #1a1a2e 100%)',
      }
    },
  },
  plugins: [],
}
