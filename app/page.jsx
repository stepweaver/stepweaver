'use client';

import Terminal from '@/components/terminal/Terminal';
import TerminalWindow from '@/components/ui/TerminalWindow';
import { useEffect, useState } from 'react';
import PostCard from '@/components/ui/PostCard';

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
    // Sort each group and pick the first
    return Object.entries(grouped)
      .map(([type, arr]) => {
        arr.sort((a, b) => new Date(b.date) - new Date(a.date));
        return { type, content: arr[0] };
      })
      .filter((item) => item.content);
  };

  return (
    <div className='space-y-8 mt-4'>
      <div className='border-l-2 border-terminal-green pl-5'>
        <h2 className='text-xl text-terminal-green'>
          # WELCOME <span className='animate-blink'>_</span>
        </h2>
        <p className='text-terminal-text mt-4'>
          I&apos;m a web developer and business analyst at the University of
          Notre Dame with a passion for creating unique digital experiences and
          building tools that help people work smarter, not harder.
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
        <h3 className='text-terminal-green text-xl mb-4 border-terminal-green pl-5'>
          # LATEST_POSTS <span className='animate-blink'>_</span>
        </h3>
        {loading ? (
          <div className='text-terminal-dimmed'>Loading posts...</div>
        ) : (
          mostRecentByType().map((item) => (
            <PostCard
              key={`${item.type}-${item.content.slug}`}
              type={item.type}
              content={item.content}
            />
          ))
        )}
      </div>
    </div>
  );
}
