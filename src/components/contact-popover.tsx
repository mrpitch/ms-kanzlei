'use client'
import { usePathname } from 'next/navigation'
import configJson from '@/lib/config.json'
import { TConfig } from '@/lib/types'
import { Phone, Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@/components/ui/popover'

export function ContactPopover() {
	const isHome = usePathname() === '/'

	if (isHome) {
		return null
	}
	const config: TConfig = configJson as TConfig
	const contact = config.contact

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" size="icon" aria-label="Kontakt">
					<Phone className="h-5 w-5 text-primary" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end">
				<PopoverHeader>
					<PopoverTitle className="text-2xl font-bold text-foreground">Kontakt</PopoverTitle>
					<PopoverDescription className="grid grid-cols-1 gap-4 pt-6">
						<a
							href={`tel:${contact.phone}`}
							className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 dark:bg-secondary dark:group-hover:bg-primary">
								<Phone className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
							</span>
							<span>{contact.phone}</span>
						</a>
						<a
							href={`mailto:${contact.email}`}
							className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 dark:bg-secondary dark:group-hover:bg-primary">
								<Mail className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
							</span>
							<span>{contact.email}</span>
						</a>
						<span className="flex items-center gap-4 text-muted-foreground">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-secondary dark:group-hover:bg-primary">
								<MapPin className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
							</span>
							<span>
								{contact.street}
								<br />
								{contact.zip} {contact.city}
							</span>
						</span>
					</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	)
}
