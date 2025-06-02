'use client';

import Terminal from '@/components/terminal/Terminal';
import TerminalWindow from '@/components/ui/TerminalWindow';
import { useEffect, useState } from 'react';
import PostItem from '@/components/ui/PostItem';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/codex');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Get all posts sorted by updated or date, most recent first
  const allRecentPosts = () => {
    return [...posts].sort((a, b) => {
      // Clean up dates by removing quotes if present
      const dateA = a.updated
        ? new Date(a.updated.replace(/^'|'$/g, ''))
        : new Date(a.date.replace(/^'|'$/g, ''));
      const dateB = b.updated
        ? new Date(b.updated.replace(/^'|'$/g, ''))
        : new Date(b.date.replace(/^'|'$/g, ''));
      return dateB - dateA;
    });
  };

  // Optional: For tag filtering if implemented later
  const handleTagClick = (tag) => {
    // For future implementation - could navigate to /codex?tag=tagName
    console.log('Tag clicked:', tag);
  };

  return (
    <div className='space-y-8 mt-4'>
      <div className='border-l-2 border-terminal-green pl-5'>
        <h2 className='text-xl text-terminal-green'>
          # WELCOME<span className='animate-blink'>_</span>
        </h2>
        <p className='text-terminal-text mt-4'>
          I&apos;m a full-stack developer and business-minded technologist using
          AI to build smarter, faster, and bolder. From custom dev tools to
          interactive digital experiences, I craft solutions that blend code,
          creativity, and strategy—because the future won&apos;t wait.
        </p>
      </div>
      <div className='text-terminal-dimmed text-sm mt-2'>$ cat welcome.md</div>
      {/* Most Recent Posts Section */}
      <div className='mt-8'>
        <TerminalWindow title='~/terminal'>
          <Terminal />
        </TerminalWindow>
      </div>
      <div className='mt-8'>
        <h3 className='text-terminal-green text-xl mb-3 flex items-center'>
          <span className='mr-2'>#</span>LATEST POSTS
          <span className='animate-blink ml-1'>_</span>
        </h3>
        {loading ? (
          <div className='text-terminal-dimmed'>Loading posts...</div>
        ) : (
          <div className='border-t border-terminal-dimmed/30 pt-2'>
            {allRecentPosts().map((post) => (
              <PostItem
                key={`${post.type}-${post.slug}`}
                type={post.type}
                content={post}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
