let cachedConfig: { apiUrl: string; runtimeEnv: string } | null = null;

export async function getConfig(): Promise<{ apiUrl: string; runtimeEnv: string }> {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      cachedConfig = config;
      return config;
    } catch (error) {
      console.error('Failed to fetch runtime config:', error);
      return {
        apiUrl: `${window.location.protocol}//${window.location.hostname}:30000`,
        runtimeEnv: 'production',
      };
    }
  }

  return {
    apiUrl: process.env.API_URL || 'http://tugo-server:8080',
    runtimeEnv: process.env.RUNTIME_ENV || 'production',
  };
}

export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:30000`;
  }
  return process.env.API_URL || 'http://tugo-server:8080';
}
