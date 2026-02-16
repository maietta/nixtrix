import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: '/home/nick/Projects/nixtrix/src/lib/packages',
			'@packages': '/home/nick/Projects/nixtrix/src/lib/packages'
		}
	}
});
