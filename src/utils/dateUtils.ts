export function formatFriendlyDate(dateStr: string): string {
  // expects YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const formatted = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date).replace('.', '');
  
  // capitalize first letter of the month
  const parts = formatted.split(' ');
  if (parts.length === 2) {
    return `${parts[0]} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
  }
  return formatted;
}

export function formatDateRangeDisplay(datesStr?: string | null): string {
  if (!datesStr) return '';
  
  // if it's stored as "start au end"
  if (datesStr.includes(' au ')) {
    const [start, end] = datesStr.split(' au ');
    return `${formatFriendlyDate(start.trim())} - ${formatFriendlyDate(end.trim())}`;
  }
  
  // if it's stored as "start - end"
  if (datesStr.includes(' - ')) {
    const [start, end] = datesStr.split(' - ');
    return `${formatFriendlyDate(start.trim())} - ${formatFriendlyDate(end.trim())}`;
  }

  // single date
  return formatFriendlyDate(datesStr.trim());
}

export function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  if (!dateTimeStr.includes('T')) return dateTimeStr; // old format fallback
  
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr;

  const datePart = formatFriendlyDate(dateTimeStr.split('T')[0]);
  const timePart = dateTimeStr.split('T')[1];
  return `${datePart}, ${timePart}`;
}

export function parseDateRange(datesStr?: string | null) {
  if (!datesStr) return { start: '', end: '' };
  
  if (datesStr.includes(' au ')) {
    const [start, end] = datesStr.split(' au ');
    return { start: start.trim(), end: end.trim() };
  }
  
  if (datesStr.includes(' - ')) {
    const [start, end] = datesStr.split(' - ');
    return { start: start.trim(), end: end.trim() };
  }

  return { start: datesStr.trim(), end: '' };
}
