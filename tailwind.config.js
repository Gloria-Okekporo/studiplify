/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F3EE',
        surface: '#FFFFFF',
        'surface-dim': '#FFF7F1',
        'surface-muted': '#F0EDE8',
        'accent-orange': '#FF8A4C',
        'accent-purple': '#B9A7FF',
        'accent-green': '#4CAF84',
        'surface-variant': '#E5E1DA',
        'text-dark': '#1C1C1C',
        'text-muted': '#6F6F6F',
        border: '#E5E1DA',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 4px 20px -5px rgba(0, 0, 0, 0.03)',
        'md': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 60px -15px rgba(0, 0, 0, 0.08)',
        'xl': '0 30px 80px -20px rgba(0, 0, 0, 0.12)',
        '2xl': '0 40px 100px -25px rgba(0, 0, 0, 0.15)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 20px -5px rgba(0, 0, 0, 0.08), 0 8px 12px -4px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -10px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 50px -12px rgba(0, 0, 0, 0.12), 0 30px 30px -15px rgba(0, 0, 0, 0.05)',
        'soft-2xl': '0 25px 80px -20px rgba(0, 0, 0, 0.15)',
        'glow-orange': '0 8px 25px -5px rgba(255, 138, 76, 0.4)',
        'glow-purple': '0 8px 25px -5px rgba(185, 167, 255, 0.4)',
        'glow-green': '0 8px 25px -5px rgba(76, 175, 132, 0.4)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
