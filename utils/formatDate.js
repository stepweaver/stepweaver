export default function formatDate(dateString) {
  // Handle undefined, null, or empty string
  if (!dateString) {
    return '[No Date]';
  }

  try {
    // Remove any surrounding quotes
    const cleanDateString = dateString.toString().replace(/^'|'$/g, '').trim();

    // Handle empty string after cleaning
    if (!cleanDateString) {
      return '[No Date]';
    }

    // Split the date string and handle potential parsing errors
    const [year, month, day] = cleanDateString
      .split('-')
      .map((part) => part.trim());

    // Validate date parts
    if (!year || !month || !day) {
      return '[Invalid Date]';
    }

    // Create date object using UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month - 1, day));

    // Validate the date
    if (isNaN(date.getTime())) {
      return '[Invalid Date]';
    }

    // Format the date
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `[${year}-${months[date.getUTCMonth()]}-${String(
      date.getUTCDate()
    ).padStart(2, '0')}]`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '[Invalid Date]';
  }
}
