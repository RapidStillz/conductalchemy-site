type AppEnv = {
  ENABLE_ADMIN: boolean;
  ADMIN_PASSWORD: string;
  DEV: boolean;
  BASE_URL: string;
  WORKER_URL: string;
};

const normaliseBasePath = (value: string | undefined): string => {
  return (value || "/").replace(/\/$/, "");
};

const normaliseUrl = (value: string | undefined): string => {
  return (value || "").replace(/\/$/, "");
};

const readBooleanFlag = (value: string | boolean | undefined): boolean => {
  return String(value ?? "").toLowerCase() === "true";
};

export const ENV: AppEnv = {
  ENABLE_ADMIN: readBooleanFlag(import.meta.env.VITE_ENABLE_ADMIN_LINK),
  ADMIN_PASSWORD: (import.meta.env.VITE_ADMIN_PASSWORD || "").trim(),
  DEV: import.meta.env.DEV,
  BASE_URL: normaliseBasePath(import.meta.env.BASE_URL),
  WORKER_URL: normaliseUrl(import.meta.env.VITE_WORKER_URL),
};
