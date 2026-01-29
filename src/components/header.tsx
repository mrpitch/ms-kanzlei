"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import {Logo} from "@/components/ui/logo"

import configJson from '@/lib/config.json';
import { TConfig } from '@/lib/types';

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
	const config: TConfig = configJson as TConfig;
	const navItems = config.navItems;

  return (
    <header className="sticky top-0 z-50 bg-primary backdrop-blur supports-backdrop-filter:bg-primary/95 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-foreground">
            <Logo />
            <span className="font-semibold text-lg tracking-tight">{config.title}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-start ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-primary-foreground hover:text-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          
          <div className="flex-1 flex justify-end">
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="outline" size="icon"
            type="button"
            className="lg:hidden p-2 ml-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
