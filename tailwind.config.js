module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
   
    extend: {},
  },
  variants: {},
  plugins: [
    "postcss-import",
    "tailwindcss",
    "autoprefixer",
    require('@tailwindcss/custom-forms'),
    ]
};
