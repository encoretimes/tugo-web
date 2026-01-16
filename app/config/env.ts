let cachedConfig: { apiUrl: string; runtimeEnv: string } | null = null;

// For Server Side
export function getServerApiUrl(): string {
  return process.env.API_URL || 'http://tugo-server:8080';
}

// For Client Side
export function getClientApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30000';
}

export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return getClientApiUrl(); // CSR
  }
  return getServerApiUrl(); // SSR
}

export async function getConfig(): Promise<{
  apiUrl: string;
  runtimeEnv: string;
}> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const config = {
    apiUrl: getApiUrl(),
    runtimeEnv: process.env.NEXT_PUBLIC_RUNTIME_ENV || 'production',
  };

  // Cache When CSR
  if (typeof window !== 'undefined') {
    cachedConfig = config;
  }

  return config;
}

// Auth Token Configuration
export const AUTH_CONFIG = {
  REFRESH_TOKEN_MAX_AGE_MS: parseInt(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_MAX_AGE_MS || '604800000',
    10
  ),
  TOKEN_REFRESH_THRESHOLD_MS: parseInt(
    process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD_MS || '2700000',
    10
  ),
} as const;
