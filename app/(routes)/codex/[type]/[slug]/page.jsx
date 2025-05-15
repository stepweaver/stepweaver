import fs from 'fs/promises';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import Post from '@/components/Post';
import Update from '@/components/mdx/Update';

const postComponents = {
  blog: Post,
  podcast: Post,
  website: Post,
  // project: Post,
  // tool: Post,
  // book: Post,
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { type, slug } = resolvedParams;

  const filePath = path.join(process.cwd(), 'content', type, `${slug}.mdx`);

  let mdxSource;
  try {
    mdxSource = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    return <div>Post not found</div>;
  }

  const { content, data: frontmatter } = matter(mdxSource);

  const PostComponent = postComponents[type] || Post;

  // MDX components with access to frontmatter
  const mdxComponents = {
    Update: () => <Update frontmatter={frontmatter} />,
  };

  return (
    <div className='mt-8 flex flex-col items-center justify-center'>
      <PostComponent
        type={type}
        title={frontmatter.title}
        date={frontmatter.date}
        excerpt={frontmatter.excerpt}
        hashtags={frontmatter.hashtags}
      >
        <div className='prose prose-invert max-w-none'>
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </PostComponent>
    </div>
  );
}
