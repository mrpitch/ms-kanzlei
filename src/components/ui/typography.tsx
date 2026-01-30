import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

export interface ITypographyProps
	extends React.HTMLAttributes<HTMLElement>,
	VariantProps<typeof typographyVariants> {
	children: React.ReactNode
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label'
	size?: 'sm' | 'xs' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
	className?: string
	id?: string
}

const typographyVariants = cva('', {
	variants: {
		as: {
			h1: 'scroll-m-20 text-4xl font-bold mb-8 tracking-tight lg:text-5xl text-balance',
			h2: 'scroll-m-20 text-3xl font-semibold tracking-tight text-balance',
			h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-balance',
			h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-balance',
			h5: 'scroll-m-20 text-lg font-semibold tracking-tight text-balance',
			h6: 'scroll-m-20 text-base font-semibold tracking-tight text-balance',
			p: 'text-base font-regular mb-4',
			label: 'text-base font-semibold tracking-tight text-balance',
		},
		size: {
			sm: 'text-sm',
			xs: 'text-xs',
			base: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
			'4xl': 'text-4xl',
		},
	},
})

const Typography: React.FC<ITypographyProps> = ({
	className,
	as = 'p',
	size,
	children,
	...props
}) => {
	const Component = as === 'p' ? 'p' : as

	const componentProps: React.HTMLAttributes<HTMLElement> = {
		...props,
		className,
	}

	componentProps.className = cn(typographyVariants({ as, size }), className)

	return <Component {...componentProps}>{children}</Component>
}

Typography.displayName = 'Typography'
export { Typography, typographyVariants }
