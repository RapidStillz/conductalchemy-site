import { ENV } from "@/config/env";

/**
 * API configuration for the Cloudflare Worker backend.
 */

export const WORKER_URL: string = ENV.WORKER_URL;

export const API_BASE = WORKER_URL;

export const IS_MOCK_MODE = !WORKER_URL;
