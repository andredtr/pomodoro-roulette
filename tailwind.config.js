export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nav: '#0E1117',
        card: '#161B22',
        secondary: '#2D3748',
        accentPrimary: '#FF5B57',
        accentSuccess: '#22C55E',
        accentInfo: '#38BDF8',
      },
      borderRadius: {
        md: '12px',
      },
      boxShadow: {
        lg: '0 4px 12px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
