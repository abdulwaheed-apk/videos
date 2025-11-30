// eslint.config.js
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";

// The full config array must be exported directly.
export default [
  // 1. TSLINT RECOMMENDED: Spread the recommended configs first.
  //    This is CORRECT: it spreads the array into the top-level exported array.
  ...tseslint.configs.recommended,

  // 2. MAIN PROJECT CONFIG: This is a single, custom configuration object.
  {
    // 3. Target the files
    files: ["**/*.{js,jsx,ts,tsx}"],

    // 4. Set up Language Options
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
    },

    // 5. Explicitly define all plugins
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@next/next": nextPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
    },

    // 6. Rules
    rules: {
      // Note: We don't need '...nextConfig.rules' here.
      // Instead, rely on the rules set by the @next/next plugin
      // and explicitly define the rest.

      // Custom TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Custom React rules
      "react/react-in-jsx-scope": "off", // Handled by Next.js/React 17+
      "react/prop-types": "off",

      // Prettier rules
      "prettier/prettier": "error",

      // OPTIONAL: Add Next.js base rules here if needed, e.g.:
      "@next/next/no-img-element": "warn",
      // ...
    },

    // Add ignores property here if needed
  },

  // 7. PRETTIER CONFIG: Apply the prettier config last to disable conflicting rules.
  prettierConfig,
];
