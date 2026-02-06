'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ModeToggle() {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			variant="secondary"
			size="icon"
			type="button"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="cursor-pointer rounded-md p-2 transition-colors"
			aria-label="Theme wechseln"
		>
			{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
		</Button>
	)
}
