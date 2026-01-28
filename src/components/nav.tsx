import Link from 'next/link';

export function Nav() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/rechtsgebiete', label: 'Rechtsgebiete' },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            MS Kanzlei
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
