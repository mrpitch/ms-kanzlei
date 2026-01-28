//export { sans, serif, mono }

/**
 * keep this sooution to be able to use local font with self hosted fonts
 */
// import { NextFontWithVariable } from 'next/dist/compiled/@next/font'

// const shouldIgnoreLocalFont =
// 	process.env.IGNORE_LOCAL_FONT === 'true' || typeof window === 'undefined'

// // Create a function to load fonts
// const loadFonts = async () => {
// 	if (shouldIgnoreLocalFont) {
// 		return {
// 			lightFont: { variable: '--font-typeNextLight' } as NextFontWithVariable,
// 			regularFont: { variable: '--font-typeNextRegular' } as NextFontWithVariable,
// 			semiBoldFont: { variable: '--font-typeNextSemiBold' } as NextFontWithVariable,
// 			boldFont: { variable: '--font-typeNextBold' } as NextFontWithVariable,
// 		}
// 	}
// 	return import('./load-fonts')
// }

// // Initialize fonts
// // Initialize fonts with default values
// let fonts: Awaited<ReturnType<typeof loadFonts>> = {
// 	lightFont: { variable: '--font-typeNextLight' } as NextFontWithVariable,
// 	regularFont: { variable: '--font-typeNextRegular' } as NextFontWithVariable,
// 	semiBoldFont: { variable: '--font-typeNextSemiBold' } as NextFontWithVariable,
// 	boldFont: { variable: '--font-typeNextBold' } as NextFontWithVariable,
// }
// // Load fonts
// loadFonts().then((loadedFonts) => {
// 	fonts = loadedFonts
// })

// export const typeNextLight = fonts?.lightFont
// export const typeNextRegular = fonts?.regularFont
// export const typeNextSemiBold = fonts?.semiBoldFont
// export const typeNextBold = fonts?.boldFont
