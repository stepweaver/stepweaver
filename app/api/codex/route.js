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
          updated: data.updated || null,
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
          updated: data.updated || null,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Website posts
  const websiteDir = path.join(process.cwd(), 'content', 'website');
  if (fs.existsSync(websiteDir)) {
    const files = fs.readdirSync(websiteDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(websiteDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'website',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          updated: data.updated || null,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Project posts
  const projectDir = path.join(process.cwd(), 'content', 'project');
  if (fs.existsSync(projectDir)) {
    const files = fs.readdirSync(projectDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(projectDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'project',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          updated: data.updated || null,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Article posts
  const articleDir = path.join(process.cwd(), 'content', 'article');
  if (fs.existsSync(articleDir)) {
    const files = fs.readdirSync(articleDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(articleDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'article',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          updated: data.updated || null,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Tool posts
  const ToolDir = path.join(process.cwd(), 'content', 'tool');
  if (fs.existsSync(ToolDir)) {
    const files = fs.readdirSync(ToolDir);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(ToolDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(source);
        posts.push({
          type: 'tool',
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          date: data.date,
          updated: data.updated || null,
          description: data.excerpt,
          hashtags: data.hashtags || [],
        });
      }
    });
  }
  // Sort posts by date descending (using updated date if available)
  posts.sort((a, b) => {
    const dateA = a.updated ? new Date(a.updated) : new Date(a.date);
    const dateB = b.updated ? new Date(b.updated) : new Date(b.date);
    return dateB - dateA;
  });
  return Response.json(posts);
}
