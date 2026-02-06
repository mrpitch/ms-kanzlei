/**
 * @type {import('next-export-optimize-images').Config}
 */
const config = {
	imageDir: '_optimized',
	cacheDir: 'out/.cache',
	quality: 90,
	convertFormat: [
		['png', 'avif'],
		['jpg', 'avif'],
		['png', 'webp'],
		['jpg', 'webp'],
	],
	generateFormats: ['avif', 'webp'],
}

module.exports = config
