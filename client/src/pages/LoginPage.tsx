// ⁘[ LOGIN PAGE ]⁘

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "@/api/hooks";
import { useAuthStore } from "@/stores/auth";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const login = useLogin();
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await login.mutateAsync({ email, password });
        setAuth(res.user, res.accessToken, res.refreshToken);
      } else {
        const res = await register.mutateAsync({ email, password, name });
        setAuth(res.user, res.accessToken, res.refreshToken);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const isLoading = login.isPending || register.isPending;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card w-full max-w-md animate-scale-in">
        <h1 className="font-display text-2xl text-center mb-2">
          {mode === "login" ? "Welcome back" : "Join BrewScore"}
        </h1>
        <p className="text-text-muted text-sm text-center mb-8">
          {mode === "login"
            ? "Sign in to track your coffee journey"
            : "Start discovering great coffee"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={8}
          />

          {error && (
            <p className="text-error text-sm bg-error/10 border border-error/20 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-text-muted text-sm text-center mt-6">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="text-brand-500 hover:text-brand-300">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-brand-500 hover:text-brand-300">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
