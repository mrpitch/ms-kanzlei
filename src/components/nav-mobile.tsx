"use client"

import { useState } from "react";
import Link from "next/link";

import { X, Menu } from "lucide-react";
import navItems from '@/lib/config';


export function NavMobileTrigger() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			
			<button
              type="button"
              className="p-2 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
		</div>
	)
}


export function NavMobileContent({ isOpen }: { isOpen: boolean }) {
	return (
		<>
		{isOpen && (
			<nav className="lg:hidden pb-6 border-t border-border pt-4">
				<div className="flex flex-col gap-4">
					{navItems.map((item) => (
						<Link key={item.href} href={item.href} className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>
							{item.label}
						</Link>
					))}
				</div>
			</nav>
		)}
		</>
	)
}
