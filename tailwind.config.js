export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bgOuter: '#0E1117',
        bgCard: '#161B22',
        bgSecondary: '#2D3748',
        accentPrimary: '#FF5B57',
        accentSuccess: '#22C55E',
        accentInfo: '#38BDF8',
        textPrimary: 'rgba(255,255,255,0.87)'
      },
      borderRadius: {
        md: '12px',
        pill: '24px'
      },
      boxShadow: {
        lg: '0 4px 12px rgba(0,0,0,0.25)'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
