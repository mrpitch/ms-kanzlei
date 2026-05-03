import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import configJson from '@/lib/config.json'
import { TConfig } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'

export function HeroSection({
	headline,
	subline,
	tagline,
}: {
	headline?: string
	subline?: string
	tagline?: string
}) {
	const config: TConfig = configJson as TConfig
	const contact = config.contact
	return (
		<div className="relative">
			<Container className="py-12 md:py-16 lg:py-24">
				<div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Left Column - Text Content */}
					<div className="mx-auto max-w-xl text-center text-primary lg:text-left dark:text-secondary">
						{tagline && <p className="mb-6 text-lg font-medium tracking-widest">{tagline}</p>}

						<h1 className="mb-6 font-serif text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-6xl">
							{headline}
						</h1>

						<p className="text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
							{subline}
						</p>
					</div>

					{/* Right Column - Contact Card */}
					<div className="w-full lg:max-w-sm lg:justify-self-end">
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-primary dark:text-secondary">
									Kontakt
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
								<a
									href={`tel:${contact.phone}`}
									className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 dark:bg-secondary dark:group-hover:bg-primary">
										<Phone className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
									</div>
									<span>{contact.phone}</span>
								</a>
								{contact.fax && (
									<div className="flex items-center gap-4 text-muted-foreground">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-secondary">
											<Printer className="h-5 w-5 text-primary" />
										</div>
										<span>{contact.fax}</span>
									</div>
								)}
								<a
									href={`mailto:${contact.email}`}
									className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 dark:bg-secondary dark:group-hover:bg-primary">
										<Mail className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
									</div>
									<span>{contact.email}</span>
								</a>
								<div className="flex items-center gap-4 text-muted-foreground">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-secondary dark:group-hover:bg-primary">
										<MapPin className="h-5 w-5 text-primary dark:group-hover:text-secondary" />
									</div>
									<span>
										{contact.street}
										<br />
										{contact.zip} {contact.city}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Container>
		</div>
	)
}
