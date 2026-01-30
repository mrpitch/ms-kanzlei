type TContact = {
	phone: string;
	email: string;
	street: string;
	zip: string;
	city: string;
}

type TNavItem = {
	href: string;
	label: string;
}

type TTestimonial = {
	name: string;
	title: string;
	company: string;
	companyUrl: string;
	text: string;
	image: string;
}
type TConfig = {
	title: string;
	description: string;
	navItems: TNavItem[];
	legalNavItems: TNavItem[];
	contact: TContact;
	testimonials: TTestimonial[];
}
export type { TConfig  };
