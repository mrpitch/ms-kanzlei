import { Geist, Lora, JetBrains_Mono } from 'next/font/google'

export const sans = Geist({
	display: 'swap',
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-sans',
})
export const serif = Lora({
	display: 'swap',
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-serif',
})
export const mono = JetBrains_Mono ({
	display: 'swap',
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-mono',
})
