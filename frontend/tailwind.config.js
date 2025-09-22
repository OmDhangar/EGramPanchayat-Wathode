/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '360px', // Custom extra-small breakpoint
      },
      fontSize: {
        // Example of responsive font sizes using clamp
        'responsive-base': 'clamp(0.875rem, 2vw, 1rem)', // 14px, 16px
        'responsive-lg': 'clamp(1rem, 2.5vw, 1.25rem)', // 16px, 20px
        'responsive-xl': 'clamp(1.125rem, 3vw, 1.5rem)', // 18px, 24px
        'responsive-2xl': 'clamp(1.25rem, 4vw, 1.875rem)', // 20px, 30px
        'responsive-3xl': 'clamp(1.5rem, 5vw, 2.25rem)', // 24px, 36px
        'responsive-4xl': 'clamp(1.875rem, 6vw, 3rem)', // 30px, 48px
        'responsive-5xl': 'clamp(2.25rem, 7vw, 3.75rem)', // 36px, 60px
      }
    },
  },
  plugins: [],
}
