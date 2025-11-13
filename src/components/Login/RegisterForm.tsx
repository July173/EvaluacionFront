import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Api/Services/AuthService";
import type { RegisterUserDto } from "../../Api/types/Auth";

type RegisterFormProps = {
  onNavigate?: (view: string) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterUserDto>({
    first_name: "",
    first_last_name: "",
    phone_number: 0,
    number_identification: 0,
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(
      (prev) =>
        ({
          ...prev,
          [name]:
            name.includes("phone") || name.includes("number")
              ? Number(value)
              : value,
        } as unknown as RegisterUserDto)
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await AuthService.register(form);
      if (data && data.isSuccess) {
        setSuccess("Registration successful. Please login.");
        setTimeout(() => {
          if (onNavigate) onNavigate("login");
          else navigate("/");
        }, 1200);
        return;
      }

      setError(data?.message || "Registration failed");
    } catch (err) {
      setError(String(err) || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-green-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                required
                className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                name="first_last_name"
                value={form.first_last_name}
                onChange={onChange}
                required
                className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone_number"
                value={form.phone_number || ""}
                onChange={onChange}
                required
                type="tel"
                className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identification number
              </label>
              <input
                name="number_identification"
                value={form.number_identification || ""}
                onChange={onChange}
                required
                type="number"
                className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                name="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={onChange}
                required
                className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          <span>¿Ya tienes cuenta?</span>
          <button
            type="button"
            onClick={() =>
              onNavigate ? onNavigate("login") : navigate("/login")
            }
            className="text-green-600 font-semibold hover:underline ml-1"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
