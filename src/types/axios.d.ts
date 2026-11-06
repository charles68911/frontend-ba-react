import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Set to true for public endpoints that should not send an auth token. */
    skipAuth?: boolean;
  }
}
