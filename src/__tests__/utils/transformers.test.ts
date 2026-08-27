/* eslint-disable */
import { describe, it, expect } from 'vitest';
import { transformTripData } from '../../utils/transformers';

describe('transformers', () => {
  it('transforms trip data correctly', () => {
    const cities = [{ id: '1', name: 'Paris', start_date: '2023-01-01', end_date: '2023-01-02' }];
    const result = transformTripData(cities as any, [], [], []);
    expect(result['1']).toBeDefined();
    expect(result['1'].name).toBe('Paris');
  });
});
