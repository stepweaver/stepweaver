export default function formatDate(dateString) {
  // Parse the date parts - handle YYYY-MM-DD format
  const [year, month, day] = dateString
    .split('-')
    .map((part) => part.trim().replace(/'/g, ''));

  // Create Date object with explicit year, month (0-indexed), day
  const date = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
  );

  // Format parts
  const formattedYear = date.getUTCFullYear();
  const formattedMonth = date
    .toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase();
  const formattedDay = String(date.getUTCDate()).padStart(2, '0');

  return `[${formattedYear}-${formattedMonth}-${formattedDay}]`;
}
