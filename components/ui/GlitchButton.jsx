'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import buttonStyles from '@/styles/buttons.module.css';
import animStyles from '@/styles/animations.module.css';
import styles from '@/styles/terminal.module.css';

export default function GlitchButton({
  href,
  children,
  className = '',
  blockCursor = true,
  brackets = true,
  type,
  onClick,
  isLoading = false,
  loadingText,
  disabled = false,
  download = false,
}) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Set up cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const buttonContent = (
    <div className='flex items-center justify-center'>
      {brackets && (
        <span
          className={`text-terminal-green ${
            isHovering ? animStyles.glitchEffect : ''
          }`}
        >
          [
        </span>
      )}
      <span
        className={`px-1 whitespace-nowrap text-terminal-text ${
          isHovering ? animStyles.textGlitchEffect : ''
        }`}
      >
        {isLoading ? loadingText || 'LOADING...' : children}
      </span>
      {brackets && (
        <span
          className={`text-terminal-green ${
            isHovering ? animStyles.glitchEffect : ''
          }`}
        >
          ]
        </span>
      )}
      {blockCursor && (
        <span
          className={`ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'} ${
            styles.crtText
          } text-terminal-green`}
        >
          ▮
        </span>
      )}
    </div>
  );

  const commonProps = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    className: `${
      buttonStyles.glitchButton
    } ${className} font-ibm flex items-center justify-center ${
      isHovering ? buttonStyles.scaleHover : buttonStyles.scaleNormal
    } ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
    disabled: disabled || isLoading,
  };

  // Render as button if type is provided or if onClick is provided but no href
  if (type || (onClick && !href)) {
    return (
      <button type={type || 'button'} onClick={onClick} {...commonProps}>
        {buttonContent}
      </button>
    );
  }

  // If we have a download attribute, use a regular anchor tag instead of Next.js Link
  if (href && download) {
    return (
      <a href={href} download {...commonProps}>
        {buttonContent}
      </a>
    );
  }

  // Otherwise render as Link
  return (
    <Link href={href || '#'} {...commonProps}>
      {buttonContent}
    </Link>
  );
}
