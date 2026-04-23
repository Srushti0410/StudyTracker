// Task API client — all calls proxy through Vite to http://localhost:5000

export interface ApiTask {
  _id: string;
  title: string;
  subject: string;
  deadline: string; // ISO string from MongoDB
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'assignment' | 'exam' | 'project';
  createdAt: string;
  updatedAt: string;
}

const BASE = '/api/tasks';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const tasksApi = {
  getAll: () => request<ApiTask[]>(BASE),

  getOne: (id: string) => request<ApiTask>(`${BASE}/${id}`),

  create: (data: Omit<ApiTask, '_id' | 'createdAt' | 'updatedAt'>) =>
    request<ApiTask>(BASE, { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<ApiTask, '_id' | 'createdAt' | 'updatedAt'>>) =>
    request<ApiTask>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<{ message: string; id: string }>(`${BASE}/${id}`, { method: 'DELETE' }),
};
