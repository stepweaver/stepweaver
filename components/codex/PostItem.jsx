'use client';

import { useState } from 'react';
import { getGlowStyle, getTypeColorValue } from '@/utils/terminalStyles';

export default function PostItem({ post, formatDate, getTypeColor }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTag, setHoveredTag] = useState(null);
  const typeColor = getTypeColor(post.type);

  return (
    <a
      href={`/codex/${post.type}/${post.slug}`}
      className='block py-0.5 px-2 rounded-sm'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title - description with date right-aligned */}
      <div className='flex items-center justify-between'>
        <div className='flex-1 min-w-0 pr-4'>
          <div className='truncate'>
            <span
              className={`text-${typeColor} font-medium transition-all duration-200`}
              style={isHovered ? getGlowStyle(post.type) : {}}
            >
              {post.title}
            </span>
            <span className='text-terminal-dimmed mx-2 font-normal'>-</span>
            <span className='text-terminal-text font-normal'>
              {post.description}
            </span>
          </div>
        </div>
        <div className='text-terminal-dimmed text-xs whitespace-nowrap'>
          {post.updated
            ? `Updated: ${formatDate(post.updated)}`
            : formatDate(post.date)}
        </div>
      </div>

      {/* Hashtags on second line (if any) */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className='text-xs text-terminal-dimmed ml-4 mt-0.5'>
          {post.hashtags.map((tag, i) => (
            <span
              key={tag}
              className='transition-colors duration-200'
              style={{
                marginLeft: i > 0 ? '0.25rem' : '0',
                color:
                  hoveredTag === tag ? getTypeColorValue(post.type) : 'inherit',
              }}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
