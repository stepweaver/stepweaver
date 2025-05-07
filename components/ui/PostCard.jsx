import React from 'react';
import formatDate from '@/utils/formatDate';
import Link from 'next/link';

export default function PostCard({ type, content, onTagClick }) {
  const typeStyles = {
    blog: 'border-terminal-green text-terminal-green',
    podcast: 'border-terminal-purple text-terminal-purple',
    website: 'border-terminal-yellow text-terminal-yellow',
    article: 'border-terminal-red text-terminal-red',
    tool: 'border-terminal-blue text-terminal-blue',
    project: 'border-terminal-magenta text-terminal-magenta',
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

  return (
    <div
      className={`border-l-2 p-3 mb-4 bg-terminal/20 ${typeStyles[type] || ''}`}
    >
      <div className='flex justify-between items-start'>
        <h3
          className={`font-ibm text-lg ${
            typeStyles[type]?.split(' ')[1] || ''
          }`}
        >
          <Link
            href={getPostUrl()}
            className={`transition-colors duration-150 hover:underline hover:text-terminal-yellow focus:text-terminal-yellow`}
          >
            {content.title}
          </Link>
        </h3>
        <span className='text-terminal-dimmed text-sm'>
          {formatDate(content.date)}
        </span>
      </div>
      <p className='text-terminal-text mt-2 mb-3'>{content.description}</p>
      <div className='flex flex-wrap gap-2'>
        {content.hashtags?.map((tag) => (
          <span
            key={tag}
            className={`text-sm cursor-pointer transition-all duration-200 ${
              typeStyles[type]?.split(' ')[1] || ''
            } ${getHashtagGlowStyle(type)}`}
            onClick={(e) => {
              e.preventDefault();
              onTagClick && onTagClick(tag);
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
