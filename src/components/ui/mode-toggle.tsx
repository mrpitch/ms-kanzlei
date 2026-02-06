'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ModeToggle() {
	const { setTheme, theme, resolvedTheme } = useTheme()

	const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

	return (
		<Button
			variant="secondary"
			size="icon"
			type="button"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="cursor-pointer rounded-md p-2 transition-colors"
			aria-label="Theme wechseln"
		>
			<Sun className="hidden h-5 w-5 dark:block" />
			<Moon className="block h-5 w-5 dark:hidden" />
		</Button>
	)
}
