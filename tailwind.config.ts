import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { leaf: '#72A05B', cocoa: '#5C3D2E', cream: '#F9F8F6' },
      borderRadius: { '4xl': '2rem' },
      fontFamily: { sans: ['var(--font-nunito)', 'sans-serif'] }
    }
  },
  plugins: []
};
export default config;
