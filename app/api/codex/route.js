import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const posts = [];

  // Helper function to safely parse dates
  const safeParseDate = (dateStr) => {
    if (!dateStr) return new Date(0); // Return epoch for missing dates
    try {
      // Expecting dateStr in 'YYYY-MM-DD' format
      const [year, month, day] = dateStr.split('-').map(Number);
      if (!year || !month || !day) return new Date(0);
      return new Date(year, month - 1, day); // month is 0-indexed
    } catch (e) {
      console.error(`Invalid date format: ${dateStr}`);
      return new Date(0);
    }
  };

  // Helper function to process a directory of posts
  const processDirectory = (dir, type) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        if (file.endsWith('.mdx')) {
          try {
            const filePath = path.join(dir, file);
            const source = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(source);
            posts.push({
              type,
              title: data.title || 'Untitled',
              slug: file.replace(/\.mdx$/, ''),
              date: data.date,
              updated: data.updated || null,
              description: data.excerpt || '',
              hashtags: data.hashtags || [],
            });
          } catch (error) {
            console.error(`Error processing file ${file}:`, error);
          }
        }
      });
    }
  };

  // Process each content type
  processDirectory(path.join(process.cwd(), 'content', 'blog'), 'blog');
  processDirectory(path.join(process.cwd(), 'content', 'podcast'), 'podcast');
  processDirectory(path.join(process.cwd(), 'content', 'project'), 'project');
  processDirectory(path.join(process.cwd(), 'content', 'article'), 'article');
  processDirectory(path.join(process.cwd(), 'content', 'tool'), 'tool');
  processDirectory(
    path.join(process.cwd(), 'content', 'community'),
    'community'
  );

  // Sort posts by date descending (using updated date if available)
  posts.sort((a, b) => {
    const dateA = a.updated ? safeParseDate(a.updated) : safeParseDate(a.date);
    const dateB = b.updated ? safeParseDate(b.updated) : safeParseDate(b.date);
    return dateB - dateA;
  });

  return Response.json(posts);
}
