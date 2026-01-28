import Link from 'next/link';
import { getPosts } from '@/lib/mdx';
import { CustomMDX } from '@/components/mdx-components';
import { getPostBySlug } from '@/lib/mdx';

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
          <h2 className="text-2xl font-bold mb-6">Seiten</h2>
          <div className="grid gap-4">
            {posts
              .filter((post) => post.slug !== 'home')
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className="block p-6 border rounded-lg hover:bg-accent transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {post.metadata.title}
                  </h3>
                  {post.metadata.description && (
                    <p className="text-muted-foreground">
                      {post.metadata.description}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
