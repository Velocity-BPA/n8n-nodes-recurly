module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
		'prettier',
	],
	env: {
		node: true,
		es2021: true,
	},
	ignorePatterns: [
		'dist/**/*',
		'node_modules/**/*',
		'gulpfile.js',
		'.eslintrc.js',
		'jest.config.js',
		'test/**/*',
	],
	rules: {
		// TypeScript rules
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-non-null-assertion': 'off',

		// n8n-nodes-base rules - adjusted for this project
		'n8n-nodes-base/node-param-description-boolean-without-whether': 'off',
		'n8n-nodes-base/node-param-placeholder-miscased-id': 'off',
		'n8n-nodes-base/node-param-default-wrong-for-collection': 'off',
		'n8n-nodes-base/node-param-description-lowercase-first-char': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'off',
		'n8n-nodes-base/node-param-option-description-identical-to-name': 'off',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',

		// General rules
		'no-console': 'off',
		'prefer-const': 'error',
		'no-var': 'error',
	},
};
