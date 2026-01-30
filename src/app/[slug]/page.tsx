import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx-components';
import { Container } from '@/components/ui/container';
import { getPosts, getPostBySlug } from '@/lib/mdx';
import { Briefcase, AlertCircle, Building2, Home, LucideIcon } from 'lucide-react';

// Map frontmatter icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home,
};

export async function generateStaticParams() {
	const posts = getPosts();
	return posts
		.filter((post) => post.slug !== 'home')
		.map((post) => ({
			slug: post.slug,
		}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return {};
	}

	return {
		title: post.metadata.title,
		description: post.metadata.description,
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const iconName = post.metadata.icon;
	const IconComponent = iconName ? iconMap[iconName] : null;

	return (
		<Container as="article" className="mt-12">
			{/* Hero intro section */}
			<div className="mb-12 pb-8 border-b">
				<div className="flex items-start gap-6">
					{IconComponent && (
						<div className="p-4 bg-secondary rounded-xl shrink-0">
							<IconComponent className="h-10 w-10 text-foreground" />
						</div>
					)}
					<div className="flex-1">
						<h1 className="text-4xl font-bold tracking-tight mb-4">
							{post.metadata.title}
						</h1>
						{post.metadata.description && (
							<p className="text-xl text-muted-foreground leading-relaxed">
								{post.metadata.description}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* MDX content */}
			<div className="text-lg prose prose-neutral dark:prose-invert max-w-none">
				<CustomMDX source={post.content} />
			</div>
		</Container>
	);
}
