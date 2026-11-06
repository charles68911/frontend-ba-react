
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfRequest) {
    csrfRequest = api
      .get<{ success: boolean; csrfToken: string }>("/csrf-token")
      .then(({ data }) => {
        csrfToken = data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  const requiresCsrf = ["post", "put", "patch", "delete"].includes(
    method ?? "",
  );

  if (requiresCsrf && !config.url?.includes("/csrf-token")) {
    const token = await getCsrfToken();

    config.headers.set("x-csrf-token", token);
  }

  return config;
});

export default api;
