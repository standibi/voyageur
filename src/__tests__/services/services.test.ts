import { describe, it, expect, vi } from 'vitest';
import { tripsService } from '../../services/trips';
import { citiesService } from '../../services/cities';
import { hotelsService } from '../../services/hotels';
import { expensesService } from '../../services/expenses';
import { activitiesService } from '../../services/activities';
import { checklistService } from '../../services/checklist';

vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(() => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '1' } }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      then: vi.fn((cb) => cb({ data: [{ id: '1' }] })),
    };
    return {
      from: vi.fn(() => mockQuery)
    };
  })
}));

describe('Services', () => {
  it('tripsService gets trips', async () => {
    const res = await tripsService.getAll();
    expect(res.data).toBeDefined();
  });
  it('citiesService gets cities', async () => {
    const res = await citiesService.getByTripId('1');
    expect(res.data).toBeDefined();
  });
  it('hotelsService gets hotels', async () => {
    const res = await hotelsService.getByCityIds(['1']);
    expect(res.data).toBeDefined();
  });
  it('expensesService gets expenses', async () => {
    const res = await expensesService.getByCityIds(['1']);
    expect(res.data).toBeDefined();
  });
  it('activitiesService gets activities', async () => {
    const res = await activitiesService.getByCityIds(['1']);
    expect(res.data).toBeDefined();
  });
  it('checklistService gets checklist', async () => {
    const res = await checklistService.getByTripId('1');
    expect(res.data).toBeDefined();
  });
});
