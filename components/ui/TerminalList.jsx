import { useState } from 'react';
import Link from 'next/link';

export default function TerminalList({ posts, activeTags = [] }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Get type color and symbol
  const getTypeInfo = (type) => {
    switch (type) {
      case 'blog':
        return { color: 'terminal-green', symbol: '📝' };
      case 'project':
        return { color: 'terminal-magenta', symbol: '✨' };
      case 'podcast':
        return { color: 'terminal-purple', symbol: '🎙️' };
      case 'community':
        return { color: 'terminal-yellow', symbol: '🌐' };
      case 'article':
        return { color: 'terminal-red', symbol: '📄' };
      case 'tool':
        return { color: 'terminal-blue', symbol: '🛠️' };
      default:
        return { color: 'terminal-green', symbol: '' };
    }
  };

  // Format date as [YYYY-MMM-DD]
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `[${date.getFullYear()}-${date
      .toLocaleString('en-US', {
        month: 'short',
      })
      .toUpperCase()}-${String(date.getDate()).padStart(2, '0')}]`;
  };

  const typeColors = {
    blog: 'text-terminal-green',
    podcast: 'text-terminal-purple',
    community: 'text-terminal-yellow',
    article: 'text-terminal-red',
    tool: 'text-terminal-blue',
    project: 'text-terminal-magenta',
  };

  return (
    <div className='space-y-1'>
      {posts.map((post, index) => {
        const { color, symbol } = getTypeInfo(post.type);
        const isHovered = hoveredItem === index;

        return (
          <Link
            key={`${post.slug}-${index}`}
            href={`/codex/${post.type}/${post.slug}`}
          >
            <div
              className={`py-2 px-3 rounded-sm ${
                isHovered ? `bg-${color}/10` : ''
              } hover:bg-${color}/10 transition-colors flex items-center`}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Type indicator (left) */}
              <div className={`text-${color} w-6 flex-shrink-0`}>{symbol}</div>

              {/* Title and description (middle) */}
              <div className='flex-grow truncate pr-4'>
                <h3
                  className={`text-${color} text-sm md:text-base font-medium`}
                >
                  {post.title}
                </h3>
                <p className='text-terminal-dimmed text-xs truncate'>
                  {post.description}
                </p>
              </div>

              {/* Right side: date and hashtags */}
              <div className='flex flex-col items-end flex-shrink-0'>
                <span
                  className='text-terminal-dimmed'
                  style={{ fontSize: '16px' }}
                >
                  {formatDate(post.date)}
                </span>

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className='flex space-x-1 mt-1'>
                    {post.hashtags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`${
                          activeTags.includes(tag)
                            ? `text-${color}`
                            : 'text-terminal-dimmed'
                        } hover:text-${color} cursor-pointer transition-colors`}
                      >
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                    {post.hashtags.length > 2 && (
                      <span className='text-terminal-dimmed text-xs'>
                        +{post.hashtags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Terminal cursor on hover */}
              {isHovered && (
                <div className='ml-2'>
                  <span className='text-terminal-green animate-blink'>_</span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
