'use client';

/**
 * Terminal-styled update component for MDX content
 * Displays the update date in terminal format with a blinking cursor
 */
export default function Update({ frontmatter }) {
  if (!frontmatter?.updated) {
    return null;
  }

  // Get updated date from frontmatter
  const date = frontmatter.updated;

  // Format as [YYYY-MM-DD]
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const bracketDate = `[${formattedDate}]`;

  return (
    <div className='update-section'>
      <div className='update-header'>
        {/* Split into separate elements for more explicit control */}
        <span className='update-command'>$ git commit -m "update</span>
        {/* This is an explicit space character */}
        <span className='update-command'>&nbsp;</span>
        <span className='update-date'>{bracketDate}</span>
        <span className='update-command'>"</span>
      </div>
      <span className='terminal-cursor'></span>
    </div>
  );
}
