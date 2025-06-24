const BASE = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'http://shuzzy.top';

export async function post<T>(route: string, data: any): Promise<T> {
  const res = await fetch(`${BASE}/api/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}