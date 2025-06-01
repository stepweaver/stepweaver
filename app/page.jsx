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

  // Group by type and get most recent
  const mostRecentByType = () => {
    const grouped = {};
    posts.forEach((post) => {
      if (!grouped[post.type]) grouped[post.type] = [];
      grouped[post.type].push(post);
    });
    // Sort each group with updated date priority and pick the first
    return Object.entries(grouped)
      .map(([type, arr]) => {
        arr.sort((a, b) => {
          const dateA = a.updated ? new Date(a.updated) : new Date(a.date);
          const dateB = b.updated ? new Date(b.updated) : new Date(b.date);
          return dateB - dateA;
        });
        return { type, content: arr[0] };
      })
      .filter((item) => item.content);
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
        I&apos;m a full-stack developer and business-minded technologist using AI to build smarter, faster, and bolder. From custom dev tools to interactive digital experiences, I craft solutions that blend code, creativity, and strategy—because the future won&apos;t wait.
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
            {mostRecentByType().map((item) => (
              <PostItem
                key={`${item.type}-${item.content.slug}`}
                type={item.type}
                content={item.content}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
