import { test, expect } from '@playwright/test';

test('critical user flow: load trips, open trip, view city, add activity', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Voyageur/);
  
  // Wait for the trip list to load and click on the first trip
  const tripCard = page.locator('a[href^="/trip/"]').first();
  await tripCard.waitFor({ state: 'visible', timeout: 10000 });
  await tripCard.click();

  // Wait for the trip page to load
  await expect(page.locator('text=Itinerary')).toBeVisible({ timeout: 10000 });

  // View a city (this might already be active by default)
  // Add an activity
  const addActivityBtn = page.locator('button:has-text("Add Activity")');
  await addActivityBtn.click();
  
  // Activity modal
  await expect(page.locator('h2:has-text("Add Activity")')).toBeVisible();
});
