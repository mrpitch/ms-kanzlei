import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx-components';
import { Container } from '@/components/ui/container';
import { getPosts, getPostBySlug } from '@/lib/mdx';
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

	return (
		<Container as="article" className="mt-12 prose prose-neutral dark:prose-invert">
			<h1>{post.metadata.title}</h1>
			{post.metadata.description && (
				<p className="text-xl text-muted-foreground">
					{post.metadata.description}
				</p>
			)}
			<CustomMDX source={post.content} />
		</Container>
	);
}
