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

type TConfig = {
	title: string;
	description: string;
	navItems: TNavItem[];
	legalNavItems: TNavItem[];
	contact: TContact;
}
export type { TConfig  };
