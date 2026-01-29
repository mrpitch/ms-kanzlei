import Link from 'next/link';
import { getPosts } from '@/lib/mdx';
import { CustomMDX } from '@/components/mdx-components';
import { getPostBySlug } from '@/lib/mdx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Briefcase, AlertCircle, Building2, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Map frontmatter icon names to Lucide components (add to this as you add more icons in MDX)
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  AlertCircle,
  Building2,
};

export default function Home() {
  const posts = getPosts();
  const homeContent = getPostBySlug('home');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {homeContent && (
          <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <h1>{homeContent.metadata.title}</h1>
            <CustomMDX source={homeContent.content} />
          </article>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Rechtsgebiete</h2>
					<div className="grid gap-6 md:grid-cols-2">
          
        </div>



          <div className="grid gap-6 md:grid-cols-2">
            {posts
              .filter((post) => !['home', 'impressum', 'datenschutz'].includes(post.slug))
              .map((post) => {
								const iconName = post.metadata.icon; // string | undefined
								const IconComponent = iconName ? iconMap[iconName] : null;
								
								return (<Card 
									key={post.slug}
									className="group hover:border-secondary transition-colors scroll-mt-24"
								>
									<Link href={`/${post.slug}`}>
									<CardHeader>
										<div className="flex items-start gap-4">
											<div className="p-3 bg-secondary rounded-lg">
                      {IconComponent ? (
                        <IconComponent className="h-6 w-6 text-foreground" />
                      ) : null}
											</div>
											<div className="flex-1">
												<CardTitle className="text-xl mb-2">{post.metadata.title}</CardTitle>
												
											</div>
										</div>
									</CardHeader>
									<CardContent className="text-base leading-relaxed">
													{post.metadata.description}
												</CardContent>
									</Link>
								</Card>
							)
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
