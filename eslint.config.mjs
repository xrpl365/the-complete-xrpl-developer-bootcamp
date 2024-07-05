import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

// Define the configuration as a constant variable
const config = [
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version or specify it
        runtime: "automatic", // Use the new JSX transform
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Ensure Node.js globals are included
      },
      ecmaVersion: 2021, // Use a recent ECMAScript version
      sourceType: "module",
    },
    rules: {
      "react/prop-types": "off", // Disable prop-types rule
      "react/react-in-jsx-scope": "off", // Disable this rule because it's unnecessary with the automatic runtime
    },
  },
];

// Export the config variable as the default export
export default config;
