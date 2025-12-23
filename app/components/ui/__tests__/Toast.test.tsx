import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';
import { useToastStore } from '@/store/toastStore';

// Mock the toast store
jest.mock('@/store/toastStore', () => ({
  useToastStore: jest.fn(),
}));

const mockRemoveToast = jest.fn();

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useToastStore as jest.Mock).mockReturnValue(mockRemoveToast);
  });

  describe('Rendering', () => {
    it('renders success toast with correct icon and message', () => {
      const toast = {
        id: '1',
        type: 'success' as const,
        message: 'Operation successful!',
      };

      render(<Toast toast={toast} />);

      expect(screen.getByText('Operation successful!')).toBeInTheDocument();
      // Success toast should have green styling
      const toastElement = screen.getByText(
        'Operation successful!'
      ).parentElement;
      expect(toastElement).toHaveClass('bg-green-50', 'border-green-200');
    });

    it('renders error toast with correct icon and message', () => {
      const toast = {
        id: '2',
        type: 'error' as const,
        message: 'Something went wrong!',
      };

      render(<Toast toast={toast} />);

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      const toastElement = screen.getByText(
        'Something went wrong!'
      ).parentElement;
      expect(toastElement).toHaveClass('bg-red-50', 'border-red-200');
    });

    it('renders info toast with correct styling', () => {
      const toast = {
        id: '3',
        type: 'info' as const,
        message: 'Here is some information',
      };

      render(<Toast toast={toast} />);

      expect(screen.getByText('Here is some information')).toBeInTheDocument();
      const toastElement = screen.getByText(
        'Here is some information'
      ).parentElement;
      expect(toastElement).toHaveClass('bg-blue-50', 'border-blue-200');
    });

    it('renders warning toast with correct styling', () => {
      const toast = {
        id: '4',
        type: 'warning' as const,
        message: 'Warning message',
      };

      render(<Toast toast={toast} />);

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      const toastElement = screen.getByText('Warning message').parentElement;
      expect(toastElement).toHaveClass('bg-yellow-50', 'border-yellow-200');
    });
  });

  describe('User Interactions', () => {
    it('calls removeToast when close button is clicked', async () => {
      const toast = {
        id: '1',
        type: 'success' as const,
        message: 'Test message',
      };

      const user = userEvent.setup();
      render(<Toast toast={toast} />);

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(mockRemoveToast).toHaveBeenCalledTimes(1);
      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });

    it('close button is keyboard accessible', async () => {
      const toast = {
        id: '1',
        type: 'info' as const,
        message: 'Test message',
      };

      const user = userEvent.setup();
      render(<Toast toast={toast} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role for close action', () => {
      const toast = {
        id: '1',
        type: 'success' as const,
        message: 'Test message',
      };

      render(<Toast toast={toast} />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('displays message text in accessible way', () => {
      const toast = {
        id: '1',
        type: 'success' as const,
        message: 'Important notification',
      };

      render(<Toast toast={toast} />);

      const message = screen.getByText('Important notification');
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass('text-sm', 'font-medium');
    });
  });

  describe('Edge Cases', () => {
    it('handles long messages', () => {
      const longMessage =
        'This is a very long message that should still be displayed correctly in the toast notification component';

      const toast = {
        id: '1',
        type: 'success' as const,
        message: longMessage,
      };

      render(<Toast toast={toast} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in message', () => {
      const toast = {
        id: '1',
        type: 'error' as const,
        message: 'Error: <script>alert("xss")</script>',
      };

      render(<Toast toast={toast} />);

      // React automatically escapes strings, so this should be safe
      expect(
        screen.getByText('Error: <script>alert("xss")</script>')
      ).toBeInTheDocument();
    });
  });
});
