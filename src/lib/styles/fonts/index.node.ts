/**
 * Node.js safe font configuration for Payload type generation
 * This file provides fallback font configurations that don't rely on next/font/google
 * which is not available during Node.js runtime (e.g., payload generate:types)
 */

export const sans = {
	variable: '--font-sans',
	className: 'font-sans',
}

export const serif = {
	variable: '--font-serif',
	className: 'font-serif',
}

export const mono = {
	variable: '--font-mono',
	className: 'font-mono',
}
