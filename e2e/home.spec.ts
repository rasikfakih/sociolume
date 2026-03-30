import { test, expect } from '@playwright/test';

test.describe('Public Marketing Site', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Sociolume/);

    // Check hero section - use heading role for more specific matching
    await expect(page.getByRole('heading', { name: 'Master Your Social Media' })).toBeVisible();

    // Check navigation - use more specific selectors
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Pricing' })).toBeVisible();
  });

  test('pricing section displays correctly', async ({ page }) => {
    await page.goto('/#pricing');

    // Check pricing cards
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Professional')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('sign in link navigates to sign in page', async ({ page }) => {
    await page.goto('/');

    // Click sign in link
    await page.click('text=Sign In');

    // Verify we're on sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  test('get started link navigates to sign up page', async ({ page }) => {
    await page.goto('/');

    // Click get started button
    await page.click('text=Start Free Trial');

    // Verify we're on sign-up page
    await expect(page).toHaveURL(/sign-up/);
  });
});

test.describe('Authentication', () => {
  test('sign in page renders correctly', async ({ page }) => {
    await page.goto('/sign-in');

    // Check sign in heading
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });

  test('sign up page renders correctly', async ({ page }) => {
    await page.goto('/sign-up');

    // Check sign up heading
    await expect(page.locator('text=Create your account')).toBeVisible();
  });
});
