
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormValues {
  identifier: string;
  password: string;
}

interface LoginErrors {
  identifier?: string;
  password?: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState<LoginFormValues>({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  function validate() {
    const nextErrors: LoginErrors = {};

    if (!values.identifier.trim()) {
      nextErrors.identifier = "Username or email is required.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await login(
        values.identifier,
        values.password,
      );

      if (!result.success) {
        setServerError(
          result.message ?? "Unable to sign in. Please try again.",
        );
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch {
      setServerError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-800">
          Sign in
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Enter your admin credentials to continue.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Username or email"
          placeholder="Enter your username or email"
          autoComplete="username"
          value={values.identifier}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              identifier: event.target.value,
            }));
            setErrors((current) => ({
              ...current,
              identifier: undefined,
            }));
          }}
          error={errors.identifier}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }));
            setErrors((current) => ({
              ...current,
              password: undefined,
            }));
          }}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowHelp((current) => !current)}
            className="text-sm text-brand hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {showHelp && (
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
            Please contact your system administrator to reset your password.
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
