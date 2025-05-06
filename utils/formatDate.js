export default function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `[${year}-${month}-${day}]`;
}
