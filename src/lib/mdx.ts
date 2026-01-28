import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MDXMetadata {
  title: string;
  description: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface MDXData {
  metadata: MDXMetadata;
  slug: string;
  content: string;
}

export function getMDXFiles(dir: string = contentDirectory): string[] {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

export function readMDXFile(filePath: string): {
  metadata: MDXMetadata;
  content: string;
} {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(rawContent);
  return { metadata: data as MDXMetadata, content };
}

export function getMDXData(dir: string = contentDirectory): MDXData[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(): MDXData[] {
  return getMDXData();
}

export function getPostBySlug(slug: string): MDXData | undefined {
  const posts = getPosts();
  return posts.find((post) => post.slug === slug);
}
