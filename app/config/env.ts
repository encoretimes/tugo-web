/**
 * Runtime environment configuration
 * This file fetches config from the server at runtime, not build time
 */

let cachedConfig: { apiUrl: string } | null = null;

export async function getConfig(): Promise<{ apiUrl: string }> {
  if (cachedConfig) {
    return cachedConfig;
  }

  // In browser, fetch from server
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      cachedConfig = config;
      return config;
    } catch (error) {
      console.error('Failed to fetch runtime config:', error);
      // Fallback to window.location for same-cluster communication
      return {
        apiUrl: `${window.location.protocol}//${window.location.hostname}:30000`,
      };
    }
  }

  // Server-side: read from environment
  return {
    apiUrl: process.env.API_URL || 'http://tugo-server:8080',
  };
}

// For client-side usage (backwards compatible)
export function getApiUrl(): string {
  // Use relative URL for same-cluster communication
  if (typeof window !== 'undefined') {
    // Browser can use window location to determine the API URL
    return `${window.location.protocol}//${window.location.hostname}:30000`;
  }
  // Server-side
  return process.env.API_URL || 'http://tugo-server:8080';
}
