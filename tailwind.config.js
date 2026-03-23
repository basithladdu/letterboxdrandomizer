/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          gray: '#C0C0C0',
          black: '#000000',
          muted: '#808080',
          white: '#FFFFFF',
          blue: '#0000FF',
          red: '#FF0000',
          yellow: '#FFFF00',
          green: '#00FF00',
          darkgreen: '#00AA00',
          navy: '#000080',
          navylight: '#1084D0',
          purple: '#800080',
          panelYellow: '#FFFFCC',
          lightgray: '#E8E8E8',
          darkgray: '#404040',
          darkgray2: '#DFDFDF',
        },
      },
      animation: {
        rainbow: 'rainbow 4s linear infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'spin-retro': 'spin 0.5s linear infinite',
        'blink': 'blink 1s steps(2, start) infinite',
      },
      keyframes: {
        rainbow: {
          '0%': { color: '#FF0000' },
          '17%': { color: '#FF8000' },
          '33%': { color: '#FFFF00' },
          '50%': { color: '#00FF00' },
          '67%': { color: '#0080FF' },
          '83%': { color: '#8000FF' },
          '100%': { color: '#FF0000' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 10px 2px rgba(255, 0, 0, 0.5)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
