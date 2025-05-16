import React from 'react';
import formatDate from '@/utils/formatDate';
import Link from 'next/link';

export default function PostCard({ type, content, onTagClick }) {
  const typeStyles = {
    blog: 'text-terminal-green',
    podcast: 'text-terminal-purple',
    website: 'text-terminal-yellow',
    article: 'text-terminal-red',
    tool: 'text-terminal-blue',
    project: 'text-terminal-magenta',
  };

  const getPostUrl = () => {
    switch (type) {
      case 'blog':
        return `/codex/blog/${content.slug}`;
      case 'podcast':
        return `/codex/podcast/${content.slug}`;
      case 'website':
        return `/codex/website/${content.slug}`;
      case 'article':
        return `/codex/article/${content.slug}`;
      case 'tool':
        return `/codex/tool/${content.slug}`;
      case 'project':
        return `/codex/project/${content.slug}`;
      default:
        return '#';
    }
  };

  const getHashtagGlowStyle = (type) => {
    switch (type) {
      case 'blog':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-green)]';
      case 'podcast':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-purple)]';
      case 'website':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-yellow)]';
      case 'article':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-red)]';
      case 'tool':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-blue)]';
      case 'project':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-magenta)]';
      default:
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-green)]';
    }
  };

  // Enhanced glow effect with more intensity
  const getEnhancedGlowStyle = (type) => {
    switch (type) {
      case 'blog':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-green)] hover:brightness-125';
      case 'podcast':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-purple)] hover:brightness-125';
      case 'website':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-yellow)] hover:brightness-125';
      case 'article':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-red)] hover:brightness-125';
      case 'tool':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-blue)] hover:brightness-125';
      case 'project':
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-magenta)] hover:brightness-125';
      default:
        return 'hover:drop-shadow-[0_0_12px_var(--color-terminal-green)] hover:brightness-125';
    }
  };

  return (
    <div className='mb-3 py-1'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <h3 className={`font-ibm ${typeStyles[type] || ''}`}>
            <Link
              href={getPostUrl()}
              className={`
                transition-colors duration-150 hover:underline
                ${getHashtagGlowStyle(type)}
              `}
            >
              {content.title}
            </Link>
          </h3>
        </div>
        <span
          className='text-terminal-dimmed whitespace-nowrap ml-4'
          style={{ fontSize: '16px' }}
        >
          {content.updated
            ? formatDate(content.updated)
            : formatDate(content.date)}
        </span>
      </div>

      <p className='text-terminal-text text-sm ml-0'>{content.description}</p>

      {content.hashtags?.length > 0 && (
        <div className='flex flex-wrap gap-2 ml-0 mt-1'>
          {content.hashtags.map((tag) => (
            <span
              key={tag}
              className={`text-xs cursor-pointer transition-all duration-200 ${
                typeStyles[type] || ''
              } ${getEnhancedGlowStyle(type)}`}
              onClick={(e) => {
                e.preventDefault();
                onTagClick && onTagClick(tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
