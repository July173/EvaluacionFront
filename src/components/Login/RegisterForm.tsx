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
    setForm((prev) => ({ ...prev, [name]: name.includes("phone") || name.includes("number") ? Number(value) : value } as unknown as RegisterUserDto));
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
          if (onNavigate) onNavigate('login');
          else navigate('/login');
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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First name</label>
          <input name="first_name" value={form.first_name} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input name="first_last_name" value={form.first_last_name} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone_number" value={form.phone_number || ''} onChange={onChange} required type="tel" className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Identification number</label>
          <input name="number_identification" value={form.number_identification || ''} onChange={onChange} required type="number" className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input name="confirm_password" type="password" value={form.confirm_password} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
      <div className="mt-4 text-sm">
        <span>¿Ya tienes cuenta? </span>
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('login') : navigate('/login')}
          className="text-green-600 font-medium ml-1"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
