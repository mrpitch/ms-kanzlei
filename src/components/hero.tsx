
import { Mail, MapPin, Phone } from "lucide-react"
import configJson from '@/lib/config.json';
import { TConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export function HeroSection({ headline, subline, tagline }: { headline?: string, subline?: string, tagline?: string }) {
	const config: TConfig = configJson as TConfig;
	const contact = config.contact;
	return (
		<div className="relative bg-background">
			<Container className="py-16 md:py-24 lg:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
					{/* Left Column - Text Content */}
					<div className="text-center lg:text-left mx-automax-w-xl">
						{tagline && (
							<p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
								{tagline}
							</p>
						)}

						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
							{headline}
						</h1>

						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
							{subline}
						</p>
					</div>

					{/* Right Column - Contact Card */}
					<div className="lg:justify-self-end w-full max-w-sm">
						<Card>
							<CardHeader>
								<CardTitle>Kontakt</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-5">
								<a
									href={`tel:${contact.phone}`}
									className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
								>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
										<Phone className="h-5 w-5 text-primary" />
									</div>
									<span>{contact.phone}</span>
								</a>
								<a
									href={`mailto:${contact.email}`}
									className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
								>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<span>{contact.email}</span>
								</a>
								<div className="flex items-center gap-4 text-muted-foreground">
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
										<MapPin className="h-5 w-5 text-primary" />
									</div>
									<span>
										{contact.street}<br />
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
