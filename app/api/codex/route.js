import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const posts = [];
  // Blog posts
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(blogDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'blog',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Podcast posts
  const podcastDir = path.join(process.cwd(), 'content', 'podcast');
  if (fs.existsSync(podcastDir)) {
    const files = fs.readdirSync(podcastDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(podcastDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'podcast',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return Response.json(posts);
}
