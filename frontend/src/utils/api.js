const BASE = import.meta.env.VITE_API_URL || "https://cooperative-sparkle-production-66b0.up.railway.app/api";

export const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
};