// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        slideInRight: 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
