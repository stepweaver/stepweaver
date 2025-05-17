'use client';

import styles from '@/styles/mdx-components.module.css';

export default function Update({ date, frontmatter, children }) {
  // Use explicit date prop if provided, otherwise use frontmatter.updated
  const dateToUse = date || (frontmatter && frontmatter.updated);

  // Format date
  const formattedDate = formatUpdateDate(dateToUse);

  return (
    <div className={styles.updateSection}>
      <div className='flex justify-end'>
        <span className={styles.updateDate}>[{formattedDate}]</span>
      </div>
      {children && <div className={styles.updateContent}>{children}</div>}
    </div>
  );
}

function formatUpdateDate(date) {
  if (!date) return formatCurrentDate();

  // Parse the date parts to avoid timezone issues
  const [year, month, day] = date.split('-').map(
    (part) => part.replace(/[^0-9]/g, '') // Remove any non-numeric characters
  );

  if (!year || !month || !day) return formatCurrentDate();

  // Build date string with explicit parts (months are 0-indexed in JS Date)
  const dateObj = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
  );

  // Format for display
  const formattedYear = dateObj.getUTCFullYear();
  const formattedMonth = dateObj
    .toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const formattedDay = String(dateObj.getUTCDate()).padStart(2, '0');

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

function formatCurrentDate() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now
    .toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
