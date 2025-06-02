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

  // Create a post object from the content and type to match PostItem's API
  const post = {
    ...content,
    type: type,
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
              style={isHovered ? getGlowStyle(type) : {}}
            >
              {content.title}
            </span>
            <span
              className='text-terminal-dimmed mx-2 font-normal transition-all duration-200'
              style={getSubtleHoverStyle()}
            >
              -
            </span>
            <span
              className='text-terminal-text font-normal transition-all duration-200'
              style={getSubtleHoverStyle()}
            >
              {content.description}
            </span>
          </div>
        </div>
        <div
          className='text-terminal-dimmed whitespace-nowrap transition-all duration-200'
          style={
            isHovered
              ? { color: typeColorValue, fontSize: '16px' }
              : { fontSize: '16px' }
          }
        >
          {getDateDisplay()}
        </div>
      </div>

      {/* Hashtags on second line (if any) */}
      {content.hashtags && content.hashtags.length > 0 && (
        <div className='text-xs text-terminal-dimmed ml-4 mt-0.5'>
          {content.hashtags.map((tag, i) => (
            <span
              key={tag}
              className='transition-colors duration-200 hover:drop-shadow-[0_0_12px_var(--color-terminal-green)] hover:brightness-125'
              style={{
                marginLeft: i > 0 ? '0.25rem' : '0',
                color: hoveredTag === tag ? getTypeColorValue(type) : 'inherit',
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
    </Link>
  );
}
