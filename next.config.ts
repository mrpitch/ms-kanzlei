import type { NextConfig } from 'next'
import withExportImages from 'next-export-optimize-images'

/** @type {import('next').NextConfig} */
const config: NextConfig = {
	output: 'export',
	reactStrictMode: true,
	images: {
		imageSizes: [640, 960, 1280, 1600, 1920],
		deviceSizes: [640, 960, 1280, 1600, 1920],
	},
}

export default withExportImages(config)
