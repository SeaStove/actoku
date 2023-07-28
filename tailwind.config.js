/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    screens: {
    'xxs': '280px',
    // => @media (min-width: 280px) { ... }

    'xs': '360px',
    // => @media (min-width: 280px) { ... }

    'sm': '600px',
    // => @media (min-width: 600px) { ... }

    'md': '768px',
    // => @media (min-width: 768px) { ... }

    'lg': '1024px',
    // => @media (min-width: 1024px) { ... }

    'xl': '1280px',
    // => @media (min-width: 1280px) { ... }

    '2xl': '1550px',
    // => @media (min-width: 1536px) { ... }
  }},
  plugins: [],
};
