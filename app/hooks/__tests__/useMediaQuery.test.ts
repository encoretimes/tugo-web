import { renderHook, waitFor, act } from '@testing-library/react';
import { useMediaQuery, useIsDesktop } from '../useMediaQuery';

describe('useMediaQuery', () => {
  // Mock matchMedia before each test
  let matchMediaMock: jest.Mock;
  let mediaQueryListMock: {
    matches: boolean;
    media: string;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    // Create mock for MediaQueryList
    mediaQueryListMock = {
      matches: false,
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    // Mock window.matchMedia
    matchMediaMock = jest.fn().mockReturnValue(mediaQueryListMock);
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('returns false when media query does not match', () => {
      mediaQueryListMock.matches = false;
      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(false);
    });

    it('returns true when media query matches', () => {
      mediaQueryListMock.matches = true;
      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(true);
    });

    it('calls matchMedia with correct query string', () => {
      const query = '(max-width: 768px)';
      renderHook(() => useMediaQuery(query));

      expect(matchMediaMock).toHaveBeenCalledWith(query);
    });
  });

  describe('Event Listener Registration', () => {
    it('registers change event listener on mount', () => {
      renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(mediaQueryListMock.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() =>
        useMediaQuery('(min-width: 1024px)')
      );

      unmount();

      expect(mediaQueryListMock.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('updates listener when query changes', () => {
      const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: '(min-width: 1024px)' },
      });

      // Clear previous calls
      mediaQueryListMock.removeEventListener.mockClear();
      mediaQueryListMock.addEventListener.mockClear();

      // Change the query
      rerender({ query: '(max-width: 768px)' });

      // Should remove old listener and add new one
      expect(mediaQueryListMock.removeEventListener).toHaveBeenCalled();
      expect(mediaQueryListMock.addEventListener).toHaveBeenCalled();
    });
  });

  describe('Dynamic Updates', () => {
    it('updates state when media query changes', async () => {
      let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

      mediaQueryListMock.addEventListener.mockImplementation(
        (event, handler) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }
      );

      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(false);

      // Simulate media query change
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: true } as MediaQueryListEvent);
        }
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('updates from true to false on window resize', async () => {
      let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

      mediaQueryListMock.matches = true;
      mediaQueryListMock.addEventListener.mockImplementation(
        (event, handler) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }
      );

      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(true);

      // Simulate window becoming smaller
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: false } as MediaQueryListEvent);
        }
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });
  });

  describe('Multiple Query Strings', () => {
    it('works with min-width query', () => {
      mediaQueryListMock.matches = true;
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(result.current).toBe(true);
    });

    it('works with max-width query', () => {
      mediaQueryListMock.matches = true;
      const { result } = renderHook(() => useMediaQuery('(max-width: 640px)'));
      expect(result.current).toBe(true);
    });

    it('works with orientation query', () => {
      mediaQueryListMock.matches = true;
      const { result } = renderHook(() =>
        useMediaQuery('(orientation: portrait)')
      );
      expect(result.current).toBe(true);
    });

    it('works with complex media query', () => {
      mediaQueryListMock.matches = true;
      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
      );
      expect(result.current).toBe(true);
    });
  });
});

describe('useIsDesktop', () => {
  let matchMediaMock: jest.Mock;
  let mediaQueryListMock: {
    matches: boolean;
    media: string;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    mediaQueryListMock = {
      matches: false,
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    matchMediaMock = jest.fn().mockReturnValue(mediaQueryListMock);
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true on desktop screen size (>= 1024px)', () => {
    mediaQueryListMock.matches = true;
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('returns false on mobile/tablet screen size (< 1024px)', () => {
    mediaQueryListMock.matches = false;
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });

  it('updates when crossing desktop breakpoint', async () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    mediaQueryListMock.matches = false;
    mediaQueryListMock.addEventListener.mockImplementation((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);

    // Simulate window becoming larger (desktop)
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
