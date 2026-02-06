import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx-components'
import { Container } from '@/components/ui/container'
import { getPosts, getPostBySlug } from '@/lib/mdx'
import { Briefcase, AlertCircle, Building2, Home, LucideIcon, ChevronLeft } from 'lucide-react'

// Map frontmatter icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home,
}

export async function generateStaticParams() {
	const posts = getPosts()
	return posts
		.filter((post) => post.slug !== 'home')
		.map((post) => ({
			slug: post.slug,
		}))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const post = getPostBySlug(slug)

	if (!post) {
		return {}
	}

	return {
		title: post.metadata.title,
		description: post.metadata.description,
	}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const post = getPostBySlug(slug)

	if (!post) {
		notFound()
	}

	const iconName = post.metadata.icon
	const IconComponent = iconName ? iconMap[iconName] : null

	return (
		<Container as="article" className="mt-12">
			<div className="mb-6">
				<Link href="/" className="flex items-center gap-2">
					<ChevronLeft className="h-4 w-4" />
					<span>Übersicht</span>
				</Link>
			</div>
			{/* Hero intro section */}
			<div className="mb-12 border-b border-border pb-8">
				<div className="flex items-start gap-4 md:gap-6">
					{IconComponent && (
						<div className="shrink-0 rounded-xl bg-secondary p-4">
							<IconComponent className="h-8 w-8 text-foreground md:h-10 md:w-10 dark:text-primary" />
						</div>
					)}
					<div className="flex-1">
						<h1 className="mb-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-5xl">
							{post.metadata.title}
						</h1>
						{post.metadata.description && (
							<p className="text-base leading-relaxed text-muted-foreground md:text-xl">
								{post.metadata.description}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* MDX content */}
			<div className="prose max-w-none text-base text-foreground prose-neutral md:text-lg dark:prose-invert prose-headings:font-serif prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl">
				<CustomMDX source={post.content} />
			</div>
		</Container>
	)
}
