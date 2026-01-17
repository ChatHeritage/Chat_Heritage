/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colori dal logo Chat Heritage
        'ch-yellow': '#FFD93D',
        'ch-orange': '#FF6B35',
        'ch-purple': '#9B5DE5',
        'ch-blue': '#4DABF7',
        'ch-green': '#7ED321',
        'ch-pink': '#E91E8B',
        'ch-teal': '#2D9EA6',
        'ch-navy': '#1E3A5F',
        'ch-brown': '#3D2914',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(155, 93, 229, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(155, 93, 229, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'url("/hero-bg.svg")',
      },
    },
  },
  plugins: [],
}
