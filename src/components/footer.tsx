import Link from 'next/link'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import { Container } from '@/components/ui/container'

import { Logo } from '@/components/ui/logo'
import configJson from '@/lib/config.json'
import { TConfig } from '@/lib/types'

export function Footer() {
	const config: TConfig = configJson as TConfig
	const navItems = config.navItems
	const legalNavItems = config.legalNavItems
	const contact = config.contact
	return (
		<footer className="mt-12 border-t border-border bg-background text-foreground md:mt-16 lg:mt-20">
			{/* Main Footer */}
			<Container as="footer" className="py-12 md:py-16 lg:py-20">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
					{/* Brand & Description */}
					<div>
						<Link href="/" className="mb-6 flex items-center gap-2">
							<Logo />
							<span className="sr-only">{config.title}</span>
						</Link>
						<p className="mb-8 max-w-md leading-relaxed text-foreground/80">{config.description}</p>
					</div>

					{/* Contact */}
					<div className="lg:justify-self-end">
						<h3 className="mb-6 font-semibold">Kontakt</h3>
						<div className="flex flex-col gap-4">
							<a
								href={`tel:${contact.phone}`}
								className="flex items-center gap-3 transition-colors hover:text-foreground/80"
							>
								<Phone className="h-4 w-4 shrink-0" />
								<span>{contact.phone}</span>
							</a>
							{contact.fax && (
								<div className="flex items-center gap-3">
									<Printer className="h-4 w-4 shrink-0" />
									<span>{contact.fax}</span>
								</div>
							)}
							<a
								href={`mailto:${contact.email}`}
								className="flex items-center gap-3 transition-colors hover:text-foreground/80"
							>
								<Mail className="h-4 w-4 shrink-0" />
								<span>{contact.email}</span>
							</a>
							<div className="flex items-start gap-3 hover:text-foreground/80">
								<MapPin className="mt-1 h-4 w-4 shrink-0" />
								<span>
									{contact.street}
									<br />
									{contact.zip} {contact.city}
								</span>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<div className="lg:justify-self-center">
						<h3 className="mb-6 font-semibold">Navigation</h3>
						<nav className="flex flex-col gap-3">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-foreground transition-colors hover:text-foreground/80"
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
				</div>
			</Container>

			{/* Copyright */}
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col items-center justify-between gap-4 text-sm text-foreground/70 md:flex-row">
					<p>
						© {new Date().getFullYear()} {config.title}. Alle Rechte vorbehalten.
					</p>
					<div className="flex gap-6">
						{legalNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="transition-colors hover:text-foreground/90"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}
