const BASE_URL = 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: <T>(url: string, headers?: HeadersInit) => request<T>(url, { method: 'GET', headers }),
  post: <T>(url: string, body: any, headers?: HeadersInit) => request<T>(url, { method: 'POST', body, headers }),
  put: <T>(url: string, body: any, headers?: HeadersInit) => request<T>(url, { method: 'PUT', body, headers }),
  delete: <T>(url: string, headers?: HeadersInit) => request<T>(url, { method: 'DELETE', headers }),
};
