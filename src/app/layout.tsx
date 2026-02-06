import type { Metadata } from 'next'

import { cn } from '@/lib/utils/cn'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'

import '@/lib/styles/globals.css'
import { sans, serif, mono } from '@/lib/styles/fonts'

export const metadata: Metadata = {
	title: 'MS Kanzlei',
	description: 'Ihre Rechtsanwaltskanzlei für kompetente rechtliche Beratung',
	formatDetection: { telephone: false, date: false, email: false, address: false },
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
	icons: {
		icon: '/images/favicon.ico',
		shortcut: '/images/favicon-32x32.png',
		apple: '/images/apple-touch-icon.png',
		other: [
			{
				rel: 'android-chrome-192x192',
				url: '/images/android-chrome-192x192.png',
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="de" suppressHydrationWarning>
			<body
				className={cn(
					'h-full min-h-screen bg-background font-sans antialiased',
					sans.variable,
					serif.variable,
					mono.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<div className="bg-amber-700 h-24 w-24"></div>
					<main>{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
