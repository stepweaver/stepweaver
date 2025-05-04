'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CodexPage() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag');

  // State for filters
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeHashtags, setActiveHashtags] = useState([]);

  // Add state for all content types
  const [content, setContent] = useState({
    blogPosts: [],
    podcastPosts: [],
    websites: [],
    articles: [],
    tools: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);

  // Format date function to display as [YYYY-MMM-DD]
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    return `[${year}-${month}-${day}]`;
  };

  // Initialize activeHashtags with the tag from URL if present
  useEffect(() => {
    if (tagParam && !activeHashtags.includes(tagParam)) {
      setActiveHashtags([tagParam]);
    }
  }, [tagParam, activeHashtags]);

  // Reference for scrolling to tag filter section when arriving with a tag parameter
  const tagFilterRef = useRef(null);

  // Scroll to tag filter section when tag is in URL
  useEffect(() => {
    if (tagParam && tagFilterRef.current) {
      // Slight delay to ensure rendering is complete
      const timeoutId = setTimeout(() => {
        tagFilterRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [tagParam]);

  // Fetch content from API
  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        // Mock data for now - will be replaced with real API call when available
        const mockData = {
          blogPosts: [
            {
              id: 1,
              title: 'Getting Started with Next.js',
              slug: 'getting-started-nextjs',
              date: '2023-05-15',
              description:
                'Learn how to build fast React applications with Next.js',
              hashtags: ['react', 'nextjs', 'frontend'],
            },
          ],
          podcastPosts: [
            {
              id: 1,
              title: 'The Future of Web Development',
              slug: 'future-web-dev',
              date: '2023-06-10',
              description: 'Discussing upcoming trends in web development',
              hashtags: ['webdev', 'future', 'tech'],
            },
          ],
          websites: [
            {
              id: 1,
              title: 'Terminal Portfolio',
              slug: 'terminal-portfolio',
              date: '2023-04-01',
              description: 'A terminal-themed personal portfolio website',
              hashtags: ['portfolio', 'terminal', 'react'],
            },
          ],
          articles: [
            {
              id: 1,
              title: 'Understanding React Hooks',
              slug: 'understanding-react-hooks',
              date: '2023-03-20',
              description: 'A deep dive into React Hooks and their use cases',
              hashtags: ['react', 'hooks', 'frontend'],
            },
          ],
          tools: [
            {
              id: 1,
              title: 'CSS Generator',
              slug: 'css-generator',
              date: '2023-07-05',
              description: 'A tool to generate CSS styles visually',
              hashtags: ['css', 'tool', 'frontend'],
            },
          ],
          projects: [
            {
              id: 1,
              title: 'Weather Dashboard',
              slug: 'weather-dashboard',
              date: '2023-08-12',
              description: 'A real-time weather dashboard using API data',
              hashtags: ['api', 'dashboard', 'react'],
            },
          ],
        };

        setContent(mockData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  // Update your allContent useMemo to use the state
  const allContent = useMemo(() => {
    // Combine all content with type information
    const combined = [
      ...content.blogPosts.map((post) => ({ type: 'blog', content: post })),
      ...content.podcastPosts.map((podcast) => ({
        type: 'podcast',
        content: podcast,
      })),
      ...content.websites.map((site) => ({
        type: 'website',
        content: site,
      })),
      ...content.articles.map((article) => ({
        type: 'article',
        content: article,
      })),
      ...content.tools.map((tool) => ({ type: 'tool', content: tool })),
      ...content.projects.map((project) => ({
        type: 'project',
        content: project,
      })),
    ];

    // Sort by date
    return combined.sort((a, b) => {
      const dateA = new Date(a.content.date);
      const dateB = new Date(b.content.date);
      return dateB - dateA;
    });
  }, [content]);

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

    // Filter by type
    if (activeTypeFilter !== 'all') {
      result = result.filter((item) => item.type === activeTypeFilter);
    }

    // Filter by hashtags
    if (activeHashtags.length > 0) {
      result = result.filter((item) => {
        const itemTags = item.content.hashtags || [];
        return activeHashtags.some((tag) => itemTags.includes(tag));
      });
    }

    return result;
  }, [allContent, activeTypeFilter, activeHashtags]);

  // Toggle hashtag selection
  const toggleHashtag = (tag) => {
    setActiveHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Placeholder render functions for each content type
  const renderContentCard = (item) => {
    const { type, content } = item;

    switch (type) {
      case 'blog':
        return (
          <div
            key={`blog-${content.slug}`}
            className='border-l-2 border-terminal-green p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-green font-ibm text-lg'>
                {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-green cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      case 'podcast':
        return (
          <div
            key={`podcast-${content.slug}`}
            className='border-l-2 border-terminal-purple p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-purple font-ibm text-lg'>
                🎙️ {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-purple cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      case 'website':
        return (
          <div
            key={`website-${content.slug}`}
            className='border-l-2 border-terminal-yellow p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-yellow font-ibm text-lg'>
                🌐 {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-yellow cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      case 'article':
        return (
          <div
            key={`article-${content.slug}`}
            className='border-l-2 border-terminal-red p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-red font-ibm text-lg'>
                📄 {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-red cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      case 'tool':
        return (
          <div
            key={`tool-${content.slug}`}
            className='border-l-2 border-terminal-blue p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-blue font-ibm text-lg'>
                🛠️ {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-blue cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      case 'project':
        return (
          <div
            key={`project-${content.slug}`}
            className='border-l-2 border-terminal-magenta p-3 mb-4 bg-terminal/20'
          >
            <div className='flex justify-between items-start'>
              <h3 className='text-terminal-magenta font-ibm text-lg'>
                ✨ {content.title}
              </h3>
              <span className='text-terminal-dimmed text-sm'>
                {formatDate(content.date)}
              </span>
            </div>
            <p className='text-terminal-text mt-2 mb-3'>
              {content.description}
            </p>
            <div className='flex flex-wrap gap-2'>
              {content.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className='text-sm text-terminal-magenta cursor-pointer hover:text-terminal-text'
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='space-y-8'>
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
                const isPulsing = tagParam === tag;

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
            filteredContent.map((item) => renderContentCard(item))
          ) : (
            <div className='text-terminal-dimmed text-center py-8'>
              No content found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
