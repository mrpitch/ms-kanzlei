import type { Metadata } from "next";


import { cn } from "@/lib/utils/cn";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

import "@/lib/styles/globals.css";
import { sans, serif, mono } from '@/lib/styles/fonts'

export const metadata: Metadata = {
	title: "MS Kanzlei",
	description: "Ihre Rechtsanwaltskanzlei für kompetente rechtliche Beratung",
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		}
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
	},
};


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="de" suppressHydrationWarning>
			<body
				className={cn(
					'bg-background h-full min-h-screen font-sans antialiased',
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
					<main>{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
