module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    inset: {
      '1/2': '50%',
      '1/4': '25%',
      '1/3': '33%',
      '4/4': '100%',
      '3/4': '75%',
    },
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
