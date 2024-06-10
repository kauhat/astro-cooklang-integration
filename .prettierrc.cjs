module.exports = {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: ["^astro/(.*)$", "^@astro(.*)$", "^astro(.*)$", "^[./]"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
