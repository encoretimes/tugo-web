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
    runtimeEnv: process.env.RUNTIME_ENV || 'production',
  };

  // Cache When CSR
  if (typeof window !== 'undefined') {
    cachedConfig = config;
  }

  return config;
}
