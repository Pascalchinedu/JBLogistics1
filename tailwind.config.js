/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['BDO Grotesk', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
        'grotesk': ['BDO Grotesk', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '400',
        'semibold': '600',
        'bold': '700',
      },
      screens: {
        'mobile': {'max': '768px'},
        'desktop': {'min': '769px'},
      },
      fontSize: {
        'xs': '10px',
        'sm': '11px',
        'base': '13px',
        'lg': '14px',
        'xl': '16px',
        '2xl': '18px',
        '3xl': '22px',
        '4xl': '26px',
        '5xl': '32px',
        '6xl': '42px',
        'h1': '28px',
        'h2': '20px',
        'h3': '16px',
        'h4': '15px',
      }
    },
  },
  plugins: [],
};