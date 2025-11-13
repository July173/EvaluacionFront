import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Api/Services/AuthService";
import { useAuth } from "../../hook/useAuth";
import type { LoginUserDto } from "../../Api/types/Auth";

type LoginFormProps = {
  onNavigate?: (view: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState<LoginUserDto>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as LoginUserDto));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use central auth provider so state is updated across the app
      try {
        const ok = await auth.login(form);
        if (ok) {
          navigate("/home");
          return;
        }
        setError("Login failed");
      } catch (e) {
        setError("Login failed");
      }
    } catch (err: unknown) {
      const maybeMsg = (err as Record<string, unknown>)["message"];
      const msg = typeof maybeMsg === "string" ? maybeMsg : String(err);
      setError(msg || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-green-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          <span>¿No tienes cuenta?</span>
          <button
            type="button"
            onClick={() =>
              onNavigate ? onNavigate("register") : navigate("/register")
            }
            className="text-green-600 font-semibold hover:underline ml-1"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
