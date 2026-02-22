import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {import("eslint").Linter.Config[]} */
export default [
	js.configs.recommended,

	prettierConfig,

	{
		languageOptions: {
			globals: {
				React: true,
				JSX: true,
				window: true,
				document: true,
				console: true,
				fetch: true,
				setTimeout: true,
				clearTimeout: true,
				setInterval: true,
				clearInterval: true,
				URL: true,
				IntersectionObserver: true,
			},
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
	},

	{
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			"@typescript-eslint": tsPlugin,
			"react-hooks": reactHooks,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: true,
			},
		},
		rules: {
			"no-undef": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			curly: "error",
			"no-else-return": "error",
			yoda: "error",
		},
	},

	{
		ignores: ["node_modules/", "dist/", "registry/", "examples/"],
	},
];
