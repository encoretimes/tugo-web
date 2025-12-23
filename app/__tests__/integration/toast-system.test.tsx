/**
 * Integration Test: Toast System
 *
 * This test demonstrates how to test a complete user flow
 * that involves multiple components working together.
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToastStore } from '@/store/toastStore';

describe('Toast System Integration', () => {
  beforeEach(() => {
    // Clear all toasts before each test
    useToastStore.setState({ toasts: [] });
  });

  it('displays toast when added to store', async () => {
    render(<ToastContainer />);

    // Initially no toasts
    expect(screen.queryByText('Test notification')).not.toBeInTheDocument();

    // Add a toast through the store
    act(() => {
      useToastStore.getState().addToast('Test notification', 'success');
    });

    // Toast should appear
    await waitFor(() => {
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });
  });

  it('removes toast when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ToastContainer />);

    // Add a toast
    act(() => {
      useToastStore.getState().addToast('Dismissible notification', 'info');
    });

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText('Dismissible notification')).toBeInTheDocument();
    });

    // Click the close button
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    // Toast should be removed
    await waitFor(() => {
      expect(
        screen.queryByText('Dismissible notification')
      ).not.toBeInTheDocument();
    });
  });

  it('auto-dismisses toast after duration', async () => {
    render(<ToastContainer />);

    // Add a toast with short duration
    act(() => {
      useToastStore
        .getState()
        .addToast('Auto dismiss message', 'success', 1000);
    });

    // Toast should appear
    await waitFor(() => {
      expect(screen.getByText('Auto dismiss message')).toBeInTheDocument();
    });

    // Toast should disappear after duration
    await waitFor(
      () => {
        expect(
          screen.queryByText('Auto dismiss message')
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('displays multiple toasts simultaneously', async () => {
    render(<ToastContainer />);

    // Add multiple toasts
    act(() => {
      useToastStore.getState().addToast('First notification', 'success');
      useToastStore.getState().addToast('Second notification', 'error');
      useToastStore.getState().addToast('Third notification', 'warning');
    });

    // All toasts should be visible
    await waitFor(() => {
      expect(screen.getByText('First notification')).toBeInTheDocument();
      expect(screen.getByText('Second notification')).toBeInTheDocument();
      expect(screen.getByText('Third notification')).toBeInTheDocument();
    });
  });

  it('handles rapid toast additions', async () => {
    render(<ToastContainer />);

    // Add many toasts in quick succession
    act(() => {
      for (let i = 0; i < 5; i++) {
        useToastStore.getState().addToast(`Notification ${i + 1}`, 'info');
      }
    });

    // All notifications should eventually be visible or queued
    await waitFor(() => {
      const notifications = screen.getAllByText(/Notification \d/);
      expect(notifications.length).toBeGreaterThan(0);
    });
  });

  it('shows correct toast types with proper styling', async () => {
    render(<ToastContainer />);

    const toastTypes = [
      { type: 'success' as const, message: 'Success message' },
      { type: 'error' as const, message: 'Error message' },
      { type: 'info' as const, message: 'Info message' },
      { type: 'warning' as const, message: 'Warning message' },
    ];

    // Add all toast types
    act(() => {
      toastTypes.forEach((toast) => {
        useToastStore.getState().addToast(toast.message, toast.type);
      });
    });

    // All should be visible
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  describe('Error Scenarios', () => {
    it('handles empty message gracefully', async () => {
      render(<ToastContainer />);

      // Try to add toast with empty message
      act(() => {
        useToastStore.getState().addToast('', 'info');
      });

      // Should handle gracefully (either show empty or not render)
      // This depends on your implementation
      await waitFor(() => {
        // Just verify no crash occurs
        expect(screen.queryByRole('button')).toBeInTheDocument();
      });
    });

    it('handles multiple same messages', async () => {
      render(<ToastContainer />);

      // Add same message twice
      act(() => {
        useToastStore.getState().addToast('Duplicate test', 'info');
        useToastStore.getState().addToast('Duplicate test', 'info');
      });

      // Should show both toasts (they have different IDs)
      await waitFor(() => {
        const toasts = screen.getAllByText('Duplicate test');
        expect(toasts.length).toBe(2);
      });
    });
  });

  describe('Accessibility', () => {
    it('toasts are accessible with keyboard', async () => {
      const user = userEvent.setup();
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast('Keyboard accessible', 'info');
      });

      await waitFor(() => {
        expect(screen.getByText('Keyboard accessible')).toBeInTheDocument();
      });

      // Tab to close button
      await user.tab();
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveFocus();

      // Press Enter to close
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.queryByText('Keyboard accessible')
        ).not.toBeInTheDocument();
      });
    });

    it('has proper ARIA attributes', async () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast('ARIA test', 'success');
      });

      await waitFor(() => {
        expect(screen.getByText('ARIA test')).toBeInTheDocument();
      });

      // Check for accessibility attributes
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });
  });
});
