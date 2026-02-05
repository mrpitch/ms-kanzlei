import Link from 'next/link';
import { getPosts } from '@/lib/mdx';
import { CustomMDX } from '@/components/mdx-components';
import { getPostBySlug } from '@/lib/mdx';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import Testimonial from '@/components/testimonial';
import { Briefcase, AlertCircle, Building2, Home as HomeIcon, LucideIcon } from 'lucide-react';

// Map frontmatter icon names to Lucide components (add to this as you add more icons in MDX)
const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home: HomeIcon,
};

export default function Home() {
	const posts = getPosts();
	const homeContent = getPostBySlug('home');

	return (
		<>
			{homeContent && (
				<CustomMDX source={homeContent.content} />
			)}
			<Container as="section" className="my-12">
				<h2 className="text-3xl font-bold font-serif tracking-tight mb-8">Rechtsgebiete</h2>
				<div className="grid gap-6 md:grid-cols-2">
					{posts
						.filter((post) => !['home', 'impressum', 'datenschutz'].includes(post.slug))
						.map((post) => {
							const iconName = post.metadata.icon; // string | undefined
							const IconComponent = iconName ? iconMap[iconName] : null;

							return (<Card
								key={post.slug}
								className="group hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1 scroll-mt-24"
							>
								<Link href={`/${post.slug}`}>
									<CardHeader>
										<div className="flex items-start gap-4">
											<div className="p-3 bg-secondary rounded-lg group-hover:bg-primary transition-colors duration-300">
												{IconComponent ? (
													<IconComponent className="h-6 w-6 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
												) : null}
											</div>
											<div className="flex-1">
												<CardTitle className="text-xl font-serif mb-2">{post.metadata.title}</CardTitle>

											</div>
										</div>
									</CardHeader>
									<CardContent className="text-base leading-relaxed text-muted-foreground">
										{post.metadata.description}
									</CardContent>
								</Link>
							</Card>
							)
						})}
				</div>
			</Container>

			<Testimonial />
		</>

	);
}
