import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';
import BuildManifest from './tools/BuildManifest.js';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [
		enhancedImages(),

		sveltekit(),

		svg({
			includePaths: ['./src/lib/svg/'],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						// by default svgo removes the viewBox which prevents svg icons from scaling
						// not a good idea! https://github.com/svg/svgo/pull/1461
						params: { overrides: { removeViewBox: false } }
					},
					// {
					// 	name: 'convertColors',
					// 	params: {
					// 		currentColor: true
					// 	}
					// },
					{ name: 'removeAttrs', params: { attrs: 'svg(width|height)' } }
				]
			}
		}),

		BuildManifest({
			manifest: {
				name: 'MAJO – Artist'
				// description: 'LW12'
				// background_color: '#fff',
				// display: 'fullscreen',
				// start_url: '/?source=pwa',
				// theme_color: '#00f'
			}
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern',
				additionalData: `@use '$lib/styles/parts/mixins' as *;`
			}
		}
	}
});
