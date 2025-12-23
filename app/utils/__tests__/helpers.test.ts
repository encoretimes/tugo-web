/**
 * Tests for utility helper functions
 *
 * This is a simple, working example of unit tests that you can run.
 * Run with: npm test helpers
 */

import {
  formatCurrency,
  truncateText,
  isValidEmail,
  calculatePercentage,
  debounce,
} from '../helpers';

describe('Utility Helpers', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers as USD', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(99.5)).toBe('$99.50');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative numbers', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });

    it('formats large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('truncateText', () => {
    it('truncates long text with ellipsis', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('returns original text if exactly max length', () => {
      expect(truncateText('Exact', 5)).toBe('Exact');
    });

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('truncates to zero characters', () => {
      expect(truncateText('Hello', 0)).toBe('...');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.kr')).toBe(true);
      expect(isValidEmail('name+tag@email.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('rejects emails without @ symbol', () => {
      expect(isValidEmail('userdomain.com')).toBe(false);
    });

    it('rejects emails without domain extension', () => {
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 2)).toBe(50);
      expect(calculatePercentage(3, 4)).toBe(75);
    });

    it('handles zero value', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it('handles zero total (division by zero)', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });

    it('rounds to nearest integer', () => {
      expect(calculatePercentage(1, 3)).toBe(33); // 33.333... rounds to 33
      expect(calculatePercentage(2, 3)).toBe(67); // 66.666... rounds to 67
    });

    it('handles values greater than total', () => {
      expect(calculatePercentage(150, 100)).toBe(150);
    });

    it('handles negative numbers', () => {
      expect(calculatePercentage(-25, 100)).toBe(-25);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous call if called again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      jest.advanceTimersByTime(500);
      debouncedFn(); // This should cancel the previous call

      jest.advanceTimersByTime(500); // Total: 1000ms from first call
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500); // Now 1000ms from second call
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('test', 123);
      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });

    it('handles multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      // Call 5 times rapidly
      debouncedFn();
      debouncedFn();
      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(1000);

      // Should only call once after all calls settle
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
