import { BACKEND_URL } from "@env";

const cleanedBaseUrl = (BACKEND_URL || "").replace(/\/+$/, "");

export const API_BASE_URL = cleanedBaseUrl;
