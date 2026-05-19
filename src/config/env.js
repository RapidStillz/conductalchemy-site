export const ENV = {
  ENABLE_ADMIN: String(import.meta.env.VITE_ENABLE_ADMIN_LINK).toLowerCase() === "true",
  ADMIN_PASSWORD: (import.meta.env.VITE_ADMIN_PASSWORD || "").trim(),
  DEV: import.meta.env.DEV,
  BASE_URL: (import.meta.env.BASE_URL || "/").replace(/\/$/, ""),
  WORKER_URL: (import.meta.env.VITE_WORKER_URL || "").replace(/\/$/, ""),
};