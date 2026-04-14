// Resolves to '' locally (Vite proxy handles /api/...)
// Resolves to the Render backend URL in production when VITE_API_URL is set at build time.
// eslint-disable-next-line no-undef
const API_BASE = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : '';

export default API_BASE;