
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "@/services/api";
import { authenticate } from "@/services/authService";
import type { AuthUser, LoginResult } from "@/types";

const AUTH_STORAGE_KEY = "cs_auth_user";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string,
  ) => Promise<LoginResult>;
  logout: () => void;
}

interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify the backend session when the app starts.
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await apiRequest<AuthApiResponse>("/auth/me");

        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void checkSession();
  }, []);

  async function login(
    identifier: string,
    password: string,
  ): Promise<LoginResult> {
    const result = await authenticate(identifier, password);

    if (!result.success || !result.user) {
      return {
        success: false,
        message: result.message,
      };
    }

    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(result.user),
    );

    localStorage.removeItem(AUTH_STORAGE_KEY);

    setUser(result.user);

    return { success: true };
  }

  function logout() {
    // Ask the backend to clear the authentication cookie.
    void apiRequest("/auth/logout", {
      method: "POST",
    }).catch(() => {
      // Clear the frontend session even if the server is unavailable.
    });

    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
