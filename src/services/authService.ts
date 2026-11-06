
import type { AuthUser, LoginResult } from "@/types";
import { apiRequest } from "@/services/api";

export interface AuthenticateResult extends LoginResult {
  user?: AuthUser;
}

interface LoginApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
  };
}

export async function authenticate(
  identifier: string,
  password: string,
): Promise<AuthenticateResult> {
  try {
    const response = await apiRequest<LoginApiResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    });

    return {
      success: response.success,
      message: response.message,
      user: response.data?.user,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again.",
    };
  }
}
