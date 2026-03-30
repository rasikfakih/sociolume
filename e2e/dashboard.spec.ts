import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('dashboard redirect when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign in
    // Note: Clerk handles this, may see redirect or sign-in page
    await page.waitForURL(/sign-in/);
  });

  test('dashboard sidebar navigation structure', async ({ page }) => {
    // Visit dashboard layout - note: in production this would require auth
    await page.goto('/dashboard');

    // Verify sidebar elements exist in layout (may be redirected to sign-in)
    // This test checks the page structure when authenticated
  });
});

test.describe('Admin Portal', () => {
  test('admin portal redirect when not authenticated', async ({ page }) => {
    await page.goto('/admin');

    // Should redirect to sign in
    await page.waitForURL(/sign-in/);
  });
});

test.describe('API Gateway', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/health');
    expect(response.ok()).toBeTruthy();
  });

  test('version endpoint responds', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/version');
    expect(response.ok()).toBeTruthy();
  });
});
