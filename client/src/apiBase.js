const envApiUrl = import.meta.env.VITE_API_URL || '';
const productionFallback = import.meta.env.PROD ? 'https://hackreact.onrender.com' : '';

const API_BASE = (envApiUrl || productionFallback).replace(/\/+$/, '');

export function apiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export default API_BASE;
