import localFont from 'next/font/local'

export const lightFont = localFont({
	src: './inter-latin-200.woff2',
	display: 'swap',
	variable: '--font-typeNextLight',
})

export const regularFont = localFont({
	src: './inter-latin-regular.woff2',
	display: 'swap',
	variable: '--font-typeNextRegular',
})

export const semiBoldFont = localFont({
	src: './inter-latin-600.woff2',
	display: 'swap',
	variable: '--font-typeNextSemiBold',
})

export const boldFont = localFont({
	src: './inter-latin-800.woff2',
	display: 'swap',
	variable: '--font-typeNextBold',
})
