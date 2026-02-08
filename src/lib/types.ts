type TContact = {
	phone: string
	email: string
	street: string
	zip: string
	city: string
}

type TNavItem = {
	href: string
	label: string
}

type TTestimonial = {
	name: string
	title: string
	company: string
	companyUrl: string
	text: string
	image: string
}
type TCookie = {
	title: string
	description: string
	consentDescription: string
	acceptLabel: string
	declineLabel: string
	learnMoreLabel: string
	learnMoreHref: string
	cookieName: string
	acceptValue: string
	declineValue: string
	maxAgeDays: number
	path: string
	sameSite: 'Lax' | 'Strict' | 'None'
	secure: boolean
}
type TConfig = {
	title: string
	description: string
	navItems: TNavItem[]
	legalNavItems: TNavItem[]
	contact: TContact
	testimonials: TTestimonial[]
	cookie: TCookie
}
export type { TConfig }
