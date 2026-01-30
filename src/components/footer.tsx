import Link from 'next/link';
import { Mail, Phone, MapPin } from "lucide-react"
import { Container } from '@/components/ui/container';

import { Logo } from '@/components/ui/logo';
import { Separator } from "@/components/ui/separator"
import configJson from '@/lib/config.json';
import { TConfig } from '@/lib/types';

export function Footer() {
	const config: TConfig = configJson as TConfig;
	const navItems = config.navItems;
	const legalNavItems = config.legalNavItems;
	const contact = config.contact;
	return (
		<footer className="bg-background text-foreground border-t border-border mt-16 md:mt-24 lg:mt-32">
			{/* Main Footer */}
			<Container as="footer" className="py-16 md:py-20">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
					{/* Brand & Description */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-2 mb-6">
							<Logo />
							<span className="font-semibold text-lg tracking-tight">{config.title}</span>
						</Link>
						<p className="text-foreground/80 leading-relaxed max-w-md mb-8">
							{config.description}
						</p>
					</div>

					{/* Navigation */}
					<div>
						<h3 className="font-semibold mb-6">Navigation</h3>
						<nav className="flex flex-col gap-3">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-foreground/80 hover:text-foreground transition-colors"
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Contact */}
					<div>
						<h3 className="font-semibold mb-6">Kontakt</h3>
						<div className="flex flex-col gap-4">
							<a
								href={`tel:${contact.phone}`}
								className="flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors"
							>
								<Phone className="h-4 w-4 shrink-0" />
								<span>{contact.phone}</span>
							</a>
							<a
								href={`mailto:${contact.email}`}
								className="flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors"
							>
								<Mail className="h-4 w-4 shrink-0" />
								<span>{contact.email}</span>
							</a>
							<div className="flex items-start gap-3 text-foreground/80">
								<MapPin className="h-4 w-4 shrink-0 mt-1" />
								<span>
									{contact.street}<br />
									{contact.zip} {contact.city}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Container>

			<Separator className="bg-primary-foreground/20" />


			{/* Copyright */}
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
					<p>© {new Date().getFullYear()} {config.title}. Alle Rechte vorbehalten.</p>
					<div className="flex gap-6">
						{legalNavItems.map((item) => (
							<Link key={item.href} href={item.href} className="hover:text-primary-foreground transition-colors">
								{item.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}

