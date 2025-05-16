'use client';

import styles from '@/styles/mdx-components.module.css';

export default function Update({ frontmatter }) {
  if (!frontmatter?.updated) {
    return null;
  }

  // Get updated date from frontmatter
  const date = frontmatter.updated;

  // Format date as YYYY-MMM-DD
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return (
    <div className={styles.updateSection}>
      <div className='flex justify-end'>
        <span className={styles.updateDate}>[{formattedDate}]</span>
      </div>
    </div>
  );
}
