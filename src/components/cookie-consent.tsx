'use client'

import * as React from 'react'

import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

import configJson from '@/lib/config.json'
import { TConfig } from '@/lib/types'

// Define prop types
interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'small' | 'mini'
	demo?: boolean
}

const config: TConfig = configJson as TConfig
const cookie = config.cookie

const escapeCookieName = (name: string) => name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

const getCookieValue = (name: string) => {
	const match = document.cookie.match(new RegExp(`(?:^|; )${escapeCookieName(name)}=([^;]*)`))
	return match ? decodeURIComponent(match[1]) : undefined
}

const buildConsentCookie = (value: string) => {
	const maxAgeSeconds = cookie.maxAgeDays * 24 * 60 * 60
	const parts = [
		`${cookie.cookieName}=${encodeURIComponent(value)}`,
		`Path=${cookie.path}`,
		`Max-Age=${maxAgeSeconds}`,
		`SameSite=${cookie.sameSite}`,
	]

	if (cookie.secure) {
		parts.push('Secure')
	}

	return parts.join('; ')
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
	({ variant = 'default', demo = false, className, ...props }, ref) => {
		const [isOpen, setIsOpen] = React.useState(false)
		const [hide, setHide] = React.useState(true)

		const handleAccept = React.useCallback(() => {
			setIsOpen(false)
			setTimeout(() => {
				setHide(true)
			}, 700)
			document.cookie = buildConsentCookie(cookie.acceptValue)
		}, [])

		const handleDecline = React.useCallback(() => {
			setIsOpen(false)
			setTimeout(() => {
				setHide(true)
			}, 700)
			document.cookie = buildConsentCookie(cookie.declineValue)
		}, [])

		React.useEffect(() => {
			try {
				if (demo) {
					setHide(false)
					setIsOpen(true)
					return
				}

				const consentValue = getCookieValue(cookie.cookieName)
				if (consentValue === cookie.acceptValue || consentValue === cookie.declineValue) {
					setHide(true)
					return
				}

				setHide(false)
				setIsOpen(true)
			} catch (error) {
				console.warn('Cookie consent error:', error)
			}
		}, [demo])

		if (hide) return null

		const containerClasses = cn(
			'fixed z-50 transition-all duration-700',
			!isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
			className,
		)

		const commonWrapperProps = {
			ref,
			className: cn(
				containerClasses,
				variant === 'mini'
					? 'right-0 bottom-4 left-0 w-full sm:left-4 sm:max-w-3xl'
					: 'right-0 bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-md',
			),
			...props,
		}

		if (variant === 'default') {
			return (
				<div {...commonWrapperProps}>
					<Card className="m-3 shadow-lg">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-lg">{cookie.title}</CardTitle>
							<Cookie className="h-5 w-5" />
						</CardHeader>
						<CardContent className="space-y-2">
							<CardDescription className="text-sm">{cookie.description}</CardDescription>
							<p className="text-xs text-muted-foreground">{cookie.consentDescription}</p>
							<Link
								href={cookie.learnMoreHref}
								className="text-xs text-primary underline underline-offset-4 hover:no-underline"
							>
								{cookie.learnMoreLabel}
							</Link>
						</CardContent>
						<CardFooter className="flex gap-2 pt-2">
							<Button onClick={handleDecline} variant="outline" className="flex-1">
								{cookie.declineLabel}
							</Button>
							<Button onClick={handleAccept} className="flex-1">
								{cookie.acceptLabel}
							</Button>
						</CardFooter>
					</Card>
				</div>
			)
		}

		if (variant === 'small') {
			return (
				<div {...commonWrapperProps}>
					<Card className="m-3 shadow-lg">
						<CardHeader className="flex h-0 flex-row items-center justify-between space-y-0 px-4 pb-2">
							<CardTitle className="text-base">{cookie.title}</CardTitle>
							<Cookie className="h-4 w-4" />
						</CardHeader>
						<CardContent className="px-4 pt-0 pb-2">
							<CardDescription className="text-sm">{cookie.description}</CardDescription>
						</CardContent>
						<CardFooter className="flex h-0 gap-2 px-4 py-2">
							<Button
								onClick={handleDecline}
								variant="outline"
								size="sm"
								className="flex-1 rounded-full"
							>
								{cookie.declineLabel}
							</Button>
							<Button onClick={handleAccept} size="sm" className="flex-1 rounded-full">
								{cookie.acceptLabel}
							</Button>
						</CardFooter>
					</Card>
				</div>
			)
		}

		if (variant === 'mini') {
			return (
				<div {...commonWrapperProps}>
					<Card className="mx-3 p-0 py-3 shadow-lg">
						<CardContent className="grid gap-4 p-0 px-3.5 sm:flex">
							<CardDescription className="flex-1 text-xs sm:text-sm">
								{cookie.description}
							</CardDescription>
							<div className="flex items-center justify-end gap-2 sm:gap-3">
								<Button onClick={handleDecline} size="sm" variant="outline" className="h-7 text-xs">
									{cookie.declineLabel}
									<span className="sr-only sm:hidden">Decline</span>
								</Button>
								<Button onClick={handleAccept} size="sm" className="h-7 text-xs">
									{cookie.acceptLabel}
									<span className="sr-only sm:hidden">Accept</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)
		}

		return null
	},
)

CookieConsent.displayName = 'CookieConsent'
export { CookieConsent }
export default CookieConsent
