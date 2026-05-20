import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'build/**',
			'coverage/**',
			'packages/react-frontend/dist/**',
		],
	},

	js.configs.recommended,

	{
		files: ['**/*.{js,jsx,mjs,cjs}'],

		plugins: {
			react: reactPlugin,
		},

		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},

			globals: {
				...globals.browser,
				...globals.node,
				...globals.jest,
			},
		},

		rules: {
			'react/react-in-jsx-scope': 'off',
			'no-unused-vars': 'warn',
		},

		settings: {
			react: {
				version: 'detect',
			},
		},
	},
];