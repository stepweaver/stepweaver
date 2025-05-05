import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Post from '@/components/Post';

const postComponents = {
  blog: Post,
  podcast: Post,
  // project: Post,
  // website: Post,
  // tool: Post,
  // book: Post,
};

export default async function Page({ params }) {
  const awaitedParams = await params;
  const { type, slug } = awaitedParams;

  // Build the path to the MDX file in /content/{type}/{slug}.mdx
  const filePath = path.join(process.cwd(), 'content', type, `${slug}.mdx`);

  let mdxSource;
  try {
    mdxSource = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    return <div>Post not found</div>;
  }

  // Parse frontmatter
  const { content, data: frontmatter } = matter(mdxSource);

  // Compile and run MDX content (without frontmatter)
  const code = String(
    await compile(content, { outputFormat: 'function-body' })
  );
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Pick the right component, default to Post if not found
  const PostComponent = postComponents[type] || Post;

  return (
    <div className='flex flex-col items-center justify-center'>
      <PostComponent
        type={type}
        title={frontmatter.title}
        date={frontmatter.date}
        excerpt={frontmatter.excerpt}
        hashtags={frontmatter.hashtags}
      >
        <Content />
      </PostComponent>
    </div>
  );
}
