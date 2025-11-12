import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Api/Services/AuthService";
import type { LoginUserDto } from "../../Api/types/Auth";

type LoginFormProps = {
  onNavigate?: (view: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
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
      const data = await AuthService.login(form);
      // backend returns { access_token, refresh_token }
      if (data && data.access_token) {
        // store tokens and redirect to home
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token || "");
        // redirect to home (app root) after successful login
        navigate("/");
        return;
      }

      // handle error response shape
      setError(data?.message || "Login failed");
    } catch (err: unknown) {
  const maybeMsg = (err as Record<string, unknown>)['message'];
  const msg = typeof maybeMsg === 'string' ? maybeMsg : String(err);
  setError(msg || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </div>
      </form>
      <div className="mt-4 text-sm">
        <span>¿No tienes cuenta? </span>
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('register') : navigate('/register')}
          className="text-green-600 font-medium ml-1"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
