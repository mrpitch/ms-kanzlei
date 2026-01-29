import Link from 'next/link';

export function Nav() {
  const navItems = [
    { href: '/arbeitsrecht', label: 'Arbeitsrecht' },
    { href: '/insolvenzrecht', label: 'Insolvenzrecht' },
		{ href: '/mietrecht', label: 'Mietrecht' },
		{ href: '/gesellschaftsrecht', label: 'Gesellschaftsrecht' },
  ];

  return (
		<nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
							key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
    </nav>
  );
}
