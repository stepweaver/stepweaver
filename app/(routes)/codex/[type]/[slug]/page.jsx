import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import fs from 'fs/promises';
import path from 'path';

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

  const code = String(
    await compile(mdxSource, { outputFormat: 'function-body' })
  );
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return <Content />;
}
