import { Navigate } from "react-router";
import { useAuth } from "@/components/context/AuthContext";
import { LoginForm } from "@/components/features/auth/LoginForm";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <span className="flex size-10 items-center justify-center rounded-md bg-brand text-xs font-bold text-white">
            CS
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Central Seafoods
            </p>
            <p className="text-xs text-neutral-500">
              Sales &amp; Inventory Analytics
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
          <LoginForm />
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 text-xs text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Central Seafoods</p>
        </div>
      </footer>
    </div>
  );
}
