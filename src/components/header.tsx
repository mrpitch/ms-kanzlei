'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactPopover } from '@/components/contact-popover'
import { Container } from '@/components/ui/container'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Logo } from '@/components/ui/logo'

import configJson from '@/lib/config.json'
import { TConfig } from '@/lib/types'

export function Header() {
	const [isOpen, setIsOpen] = useState(false)
	const config: TConfig = configJson as TConfig
	const navItems = config.navItems

	return (
		<div className="sticky top-0 z-50 border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background/60">
			<Container as="header">
				<div className="flex h-16 items-center justify-between md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 text-foreground">
						<Logo name={config.title} />
					</Link>

					{/* Desktop Navigation */}
					<nav className="flex-start ml-8 hidden items-center gap-8 lg:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-lg text-foreground transition-colors hover:text-foreground/80"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex flex-1 justify-end gap-2">
						<ContactPopover />
						<ModeToggle />
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="secondary"
						size="icon"
						type="button"
						className="ml-2 cursor-pointer rounded-md p-2 transition-colors lg:hidden"
						onClick={() => setIsOpen(!isOpen)}
						aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
					>
						{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<nav className="border-t border-border pt-4 pb-6 lg:hidden">
						<div className="flex flex-col gap-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="py-2 text-base text-muted-foreground transition-colors hover:text-foreground"
									onClick={() => setIsOpen(false)}
								>
									{item.label}
								</Link>
							))}
						</div>
					</nav>
				)}
			</Container>
		</div>
	)
}
