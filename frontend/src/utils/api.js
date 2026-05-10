const BASE = "https://cooperative-sparkle-production-66b0.up.railway.app/api";

console.log("BASE URL:", BASE); // ✅ agrega esto

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