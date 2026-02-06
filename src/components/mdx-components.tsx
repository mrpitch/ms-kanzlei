import Link from 'next/link'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { ComponentPropsWithoutRef } from 'react'
import { HeroSection } from '@/components/hero'

function CustomLink(props: ComponentPropsWithoutRef<'a'>) {
	const href = props.href

	if (!href) {
		return <a {...props} />
	}

	if (href.startsWith('/')) {
		return (
			<Link href={href} {...props}>
				{props.children}
			</Link>
		)
	}

	if (href.startsWith('#')) {
		return <a {...props} />
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />
}

const components = {
	a: CustomLink,
	HeroSection,
}

export function CustomMDX(props: MDXRemoteProps) {
	return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
}
