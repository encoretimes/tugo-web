const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // FormData인 경우 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    const isFormData = options.body instanceof FormData;

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: isFormData
        ? { ...options.headers }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      if (response.status === 401) {
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
        }
      }

      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return undefined as T;
    }

    const data = await response.json();

    // 백엔드가 ApiResponse 형태로 감싸서 반환하는 경우
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    // 백엔드가 직접 데이터를 반환하는 경우
    return data as T;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    // FormData는 그대로 전달, 그 외에는 JSON.stringify
    const body = data instanceof FormData ? data : JSON.stringify(data);

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
