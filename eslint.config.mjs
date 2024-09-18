import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/lib/css/", "src/lib/modules/", "src/lib/bundle.js", "dist/lib/"],
}, ...compat.extends("eslint:recommended"), {
    plugins: {
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            jsPlumb: true,
        },

        ecmaVersion: 2022,
        sourceType: "module",
    },

    settings: {
        "import/resolver": ["node"],
    },

    rules: {
        "no-unused-vars": "off",
        "one-var": ["error", "never"],
        "no-var": "error",
        "prefer-const": "error",
        "object-shorthand": ["error", "always"],
        "prefer-arrow-callback": "error",

        "prefer-destructuring": ["warn", {
            object: true,
            array: false,
        }],

        "prefer-object-spread": "error",
        "prefer-template": "error",
        "unused-imports/no-unused-imports": "error",
    },
}];