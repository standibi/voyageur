import { describe, it, expect } from 'vitest';
import { formatDateRangeDisplay, formatFriendlyDate } from '../../utils/dateUtils';

describe('dateUtils', () => {
  it('formats friendly date', () => {
    expect(formatFriendlyDate('2023-01-01')).toBe('1 Janv');
  });
  it('formats date range display', () => {
    expect(formatDateRangeDisplay({ start: '2023-01-01', end: '2023-01-10' })).toBe('1 Janv - 10 Janv');
  });
});
