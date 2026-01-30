import { cn } from '@/lib/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const containerVariants = cva('container mx-auto', {
	variants: {
		variant: {
			default: 'px-6 lg:px-20',
			header: 'px-4',
			footer: 'px-4 py-16 md:py-20',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface IContainerProps
	extends React.HTMLAttributes<HTMLElement>,
	VariantProps<typeof containerVariants> {
	children: React.ReactNode
	as?: 'div' | 'main' | 'nav' | 'section' | 'footer' | 'header' | 'article'
}

const Container: React.FC<IContainerProps> = ({ className, as = 'div', children, ...props }) => {
	const Component = as === 'div' ? 'div' : as

	return (
		<Component
			className={cn(
				containerVariants({
					variant: as === 'header' ? 'header' : as === 'footer' ? 'footer' : 'default',
					className,
				}),
			)}
			{...props}
		>
			{children}
		</Component>
	)
}

Container.displayName = 'Container'
export { Container }
