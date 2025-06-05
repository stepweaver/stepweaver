'use client';

import { useState } from 'react';
import {
  getGlowStyle,
  getTypeColorValue,
  getTypeColor,
} from '@/utils/terminalStyles';
import formatDate from '@/utils/formatDate';
import Link from 'next/link';

export default function PostItem({ type, content, onTagClick }) {
  // Add validation
  if (!type || !content) {
    console.error('PostItem: Required props missing', { type, content });
    return null;
  }

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTag, setHoveredTag] = useState(null);
  const typeColor = getTypeColor(type);
  const typeColorValue = getTypeColorValue(type);

  // More subtle hover style that's still readable
  const getSubtleHoverStyle = () => {
    return isHovered
      ? {
          color: typeColorValue,
          fontWeight: 'medium',
        }
      : {};
  };

  // Format the date display
  const getDateDisplay = () => {
    if (content.updated) {
      return `Updated: ${formatDate(content.updated)}`;
    }
    if (content.date) {
      return formatDate(content.date);
    }
    return '[No Date]';
  };

  return (
    <Link
      href={`/codex/${type}/${content.slug}`}
      className='block py-2 px-3 rounded hover:bg-terminal-bg/30 transition-colors duration-200'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex flex-col'>
        {/* Header row with title and date */}
        <div className='flex items-center justify-between mb-1'>
          <span
            className={`text-${typeColor} font-medium transition-all duration-200`}
            style={isHovered ? getGlowStyle(type) : {}}
          >
            {content.title}
          </span>
          <span
            className='text-terminal-dimmed text-sm whitespace-nowrap ml-4 transition-all duration-200'
            style={isHovered ? { color: typeColorValue } : {}}
          >
            {getDateDisplay()}
          </span>
        </div>

        {/* Description row */}
        <div className='text-terminal-text text-sm'>{content.description}</div>

        {/* Hashtags row */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div className='text-xs text-terminal-dimmed mt-1.5'>
            {content.hashtags.map((tag, i) => (
              <span
                key={tag}
                className='transition-colors duration-200 hover:drop-shadow-[0_0_12px_var(--color-terminal-green)] hover:brightness-125'
                style={{
                  marginLeft: i > 0 ? '0.5rem' : '0',
                  color:
                    hoveredTag === tag ? getTypeColorValue(type) : 'inherit',
                }}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag(null)}
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
    </Link>
  );
}
