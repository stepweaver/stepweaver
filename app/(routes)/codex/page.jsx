'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/ui/PostCard';

export default function CodexPage() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag');

  // State for filters
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeHashtags, setActiveHashtags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from API
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

  // Sort all posts by date descending
  const allContent = useMemo(() => {
    return posts
      .map((post) => ({ type: post.type, content: post }))
      .sort((a, b) => new Date(b.content.date) - new Date(a.content.date));
  }, [posts]);

  // Get all unique hashtags for filter buttons
  const allHashtags = useMemo(() => {
    const tags = new Set();
    allContent.forEach((item) => {
      if (item.content.hashtags) {
        item.content.hashtags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [allContent]);

  // Filter content based on selected filters
  const filteredContent = useMemo(() => {
    let result = allContent;
    if (activeTypeFilter !== 'all') {
      result = result.filter((item) => item.type === activeTypeFilter);
    }
    if (activeHashtags.length > 0) {
      result = result.filter((item) => {
        const itemTags = item.content.hashtags || [];
        return activeHashtags.some((tag) => itemTags.includes(tag));
      });
    }
    return result;
  }, [allContent, activeTypeFilter, activeHashtags]);

  // Only set activeHashtags from tagParam on initial load
  const initializedFromUrl = useRef(false);
  useEffect(() => {
    if (tagParam && !initializedFromUrl.current) {
      setActiveHashtags([tagParam]);
      initializedFromUrl.current = true;
    }
  }, [tagParam]);

  // Reference for scrolling to tag filter section when arriving with a tag parameter
  const tagFilterRef = useRef(null);

  // Scroll to tag filter section when tag is in URL
  useEffect(() => {
    if (tagParam && tagFilterRef.current) {
      const timeoutId = setTimeout(() => {
        tagFilterRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [tagParam]);

  // Toggle hashtag selection
  const toggleHashtag = (tag) => {
    setActiveHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className='space-y-8 mt-8'>
      <div>
        {/* Filters */}
        <div className='mt-6 mb-8'>
          {/* Type filter */}
          <div className='mb-4'>
            <div className='flex items-center justify-center w-full mb-4'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed'>filter by type:</span>
            </div>
            <div className='flex flex-wrap gap-2 justify-evenly mx-auto max-w-4xl'>
              <button
                onClick={() => setActiveTypeFilter('all')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'all'
                    ? 'bg-terminal-green text-black border-terminal-green'
                    : 'bg-terminal-green/20 text-terminal-green border-terminal-green'
                }`}
              >
                all
              </button>
              <button
                onClick={() => setActiveTypeFilter('blog')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'blog'
                    ? 'bg-terminal-green text-black border-terminal-green'
                    : 'bg-terminal-green/20 text-terminal-green border-terminal-green'
                }`}
              >
                {activeTypeFilter !== 'blog' && (
                  <span className='mr-1'>📝</span>
                )}
                blog
              </button>
              <button
                onClick={() => setActiveTypeFilter('podcast')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'podcast'
                    ? 'bg-terminal-purple text-black border-terminal-purple'
                    : 'bg-terminal-purple/20 text-terminal-purple border-terminal-purple'
                }`}
              >
                {activeTypeFilter !== 'podcast' && (
                  <span className='mr-1'>🎙️</span>
                )}
                podcast
              </button>
              <button
                onClick={() => setActiveTypeFilter('website')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'website'
                    ? 'bg-terminal-yellow text-black border-terminal-yellow'
                    : 'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow'
                }`}
              >
                {activeTypeFilter !== 'website' && (
                  <span className='mr-1'>🌐</span>
                )}
                website
              </button>
              <button
                onClick={() => setActiveTypeFilter('article')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'article'
                    ? 'bg-terminal-red text-black border-terminal-red'
                    : 'bg-terminal-red/20 text-terminal-red border-terminal-red'
                }`}
              >
                {activeTypeFilter !== 'article' && (
                  <span className='mr-1'>📄</span>
                )}
                article
              </button>
              <button
                onClick={() => setActiveTypeFilter('tool')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'tool'
                    ? 'bg-terminal-blue text-black border-terminal-blue'
                    : 'bg-terminal-blue/20 text-terminal-blue border-terminal-blue'
                }`}
              >
                {activeTypeFilter !== 'tool' && (
                  <span className='mr-1'>🛠️</span>
                )}
                tool
              </button>
              <button
                onClick={() => setActiveTypeFilter('project')}
                className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${
                  activeTypeFilter === 'project'
                    ? 'bg-terminal-magenta text-black border-terminal-magenta'
                    : 'bg-terminal-magenta/20 text-terminal-magenta border-terminal-magenta'
                }`}
              >
                {activeTypeFilter !== 'project' && (
                  <span className='mr-1'>✨</span>
                )}
                project
              </button>
            </div>
          </div>

          {/* Tag filter */}
          <div ref={tagFilterRef} className='mb-4'>
            <div className='flex items-center justify-center w-full mb-4'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed'>filter by tag:</span>
            </div>
            <div className='flex flex-wrap gap-2 justify-center mx-auto max-w-4xl'>
              {allHashtags.map((tag) => {
                const isSelected = activeHashtags.includes(tag);
                const isPulsing = tagParam === tag && isSelected;

                return (
                  <button
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`px-2 text-sm rounded border inline-flex items-center justify-center cursor-pointer 
                      ${
                        isSelected
                          ? 'bg-terminal-green text-black border-terminal-green'
                          : 'bg-black text-terminal-green border-terminal-green'
                      }
                      ${isPulsing ? 'animate-pulse' : ''}
                    `}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content display */}
        <div className='space-y-3'>
          {loading ? (
            <div className='text-terminal-dimmed text-center py-8'>
              <span className='animate-pulse'>Loading content...</span>
            </div>
          ) : filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <PostCard
                key={`${item.type}-${item.content.slug}`}
                type={item.type}
                content={item.content}
                onTagClick={toggleHashtag}
              />
            ))
          ) : (
            <div className='text-terminal-dimmed text-center py-8'>
              No {activeTypeFilter} posts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
