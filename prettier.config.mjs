const pretterConfig = {
  singleQuote: true,
  trailingComma: "all",
  semi: false,
  bracketSpacing: true,
  tabWidth: 2,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react",
    "^.(css|scss)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
export default pretterConfig;
