import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  slugify,
  capitalize,
  truncate,
  initials,
  formatNumber,
  formatCurrency,
  isValidEmail,
  isValidUrl,
  debounce,
  cn,
} from '../src';

describe('Date Utilities', () => {
  it('formats date correctly', () => {
    const result = formatDate('2026-03-28');
    expect(result).toContain('2026');
  });

  it('formats datetime correctly', () => {
    const result = formatDateTime('2026-03-28T12:00:00Z');
    expect(result).toContain('2026');
  });

  it('formats relative time for recent dates', () => {
    const now = new Date().toISOString();
    const result = formatRelativeTime(now);
    expect(result).toBe('just now');
  });
});

describe('String Utilities', () => {
  it('creates slug from text', () => {
    const result = slugify('Hello World!');
    expect(result).toBe('hello-world');
  });

  it('capitalizes text', () => {
    const result = capitalize('hello');
    expect(result).toBe('Hello');
  });

  it('truncates long text', () => {
    const result = truncate('Hello World', 5);
    expect(result).toBe('He...');
  });

  it('generates initials', () => {
    const result = initials('John', 'Doe');
    expect(result).toBe('JD');
  });
});

describe('Number Utilities', () => {
  it('formats number with commas', () => {
    const result = formatNumber(1234567);
    expect(result).toContain('1');
    expect(result).toContain(',');
  });

  it('formats currency', () => {
    const result = formatCurrency(99.99);
    expect(result).toContain('$');
  });
});

describe('Validation Utilities', () => {
  it('validates correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('validates correct URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('rejects invalid URL', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });
});

describe('Utility Functions', () => {
  it('debounces function calls', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 50);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(callCount).toBe(1);
  });

  it('combines class names', () => {
    const result = cn('foo', 'bar', undefined, null, false);
    expect(result).toBe('foo bar');
  });
});
