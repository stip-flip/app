const { default: colorNames } = require('daisyui/src/colors/colorNames');
// const plugin = require('tailwindcss/plugin');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
		}
	},
	daisyui: {
		themes: [
			{
				dark: {
					...require('daisyui/src/colors/themes')['[data-theme=dark]'],
				},
				light: {
					...require('daisyui/src/colors/themes')['[data-theme=winter]'],
				}
			},
		]
	},
	plugins: [
		require('daisyui'),
	]
};
