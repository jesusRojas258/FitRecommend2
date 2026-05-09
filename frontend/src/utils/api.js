const BASE = "http://localhost:3000/api";

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