// Central API base URL for frontend
// Use REACT_APP_API_URL if provided, otherwise fall back to local dev.
const DEFAULT_API = "http://localhost:3001/api";

export const API_BASE_URL = process.env.REACT_APP_API_URL?.trim() || DEFAULT_API;


