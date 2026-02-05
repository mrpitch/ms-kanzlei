"use client"
import { usePathname } from "next/navigation";
import configJson from '@/lib/config.json';
import { TConfig } from '@/lib/types';
import { Phone, Mail, MapPin } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";


export function ContactPopover() {

	const isHome = usePathname() === '/';

	if (isHome) {
		return null;
	}
	const config: TConfig = configJson as TConfig;
	const contact = config.contact;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" size="icon" aria-label="Kontakt">
					<Phone className="h-5 w-5 text-primary" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end">
				<PopoverHeader>
					<PopoverTitle className="text-primary text-2xl font-bold">Kontakt</PopoverTitle>
					<PopoverDescription className="grid grid-cols-1 gap-4 pt-6">
						<a
							href={`tel:${contact.phone}`}
							className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
						>
							<span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
								<Phone className="h-5 w-5 text-primary" />
							</span>
							<span>{contact.phone}</span>
						</a>
						<a
							href={`mailto:${contact.email}`}
							className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
						>
							<span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
								<Mail className="h-5 w-5 text-primary" />
							</span>
							<span>{contact.email}</span>
						</a>
						<span className="flex items-center gap-4 text-muted-foreground">
							<span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
								<MapPin className="h-5 w-5 text-primary" />
							</span>
							<span>
								{contact.street}<br />
								{contact.zip} {contact.city}
							</span>
						</span>
					</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	)
}
