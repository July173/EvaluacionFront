import React, { useState } from 'react';

type Validator = 'email' | RegExp | ((v: unknown) => string | null)

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validator?: Validator;
  options?: Array<{ label: string; value: string | number }>;
};

type Props = {
  fields: Field[];
  initial?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  submitLabel?: string;
};

const UiForm: React.FC<Props> = ({ fields, initial = {}, onSubmit, submitLabel = 'Guardar' }) => {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (name: string, v: unknown) => {
    setValues((s) => ({ ...s, [name]: v }));
    setErrors((e) => ({ ...e, [name]: null }));
    setServerError(null);
  };

  const runValidator = (validator: Validator | undefined, value: unknown) => {
    if (!validator) return null;
    if (validator === 'email') {
      const re = /^\S+@\S+\.\S+$/;
      return re.test(String(value || '')) ? null : 'Formato de correo inválido';
    }
    if (validator instanceof RegExp) {
      return validator.test(String(value || '')) ? null : 'Valor inválido';
    }
    if (typeof validator === 'function') {
      return validator(value);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string | null> = {};

    for (const f of fields) {
      const val = values[f.name];
      if (f.required && (val === undefined || val === null || String(val).trim() === '')) {
        newErrors[f.name] = 'Campo requerido';
        continue;
      }
      const vErr = runValidator(f.validator, val);
      if (vErr) newErrors[f.name] = vErr;
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((x) => x != null);
    if (hasErrors) return;

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (err: unknown) {
      // show backend error if present
      const maybeObj = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      const msg = maybeObj && typeof maybeObj['message'] !== 'undefined' ? String(maybeObj['message']) : String(err ?? 'Error');
      setServerError(String(msg));
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm text-gray-700 mb-1">{f.label}</label>
            {f.options ? (
              <select
                value={String(values[f.name] ?? '')}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className={`w-full border rounded px-3 py-2 ${errors[f.name] ? 'border-red-400' : ''}`}
              >
                <option value="">Seleccione...</option>
                {f.options.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                value={String(values[f.name] ?? '')}
                onChange={(e) => handleChange(f.name, e.target.value)}
                placeholder={f.placeholder}
                type={f.type || 'text'}
                className={`w-full border rounded px-3 py-2 ${errors[f.name] ? 'border-red-400' : ''}`}
              />
            )}
            {errors[f.name] && <p className="text-sm text-red-600 mt-1">{errors[f.name]}</p>}
          </div>
        ))}
      </div>

      {serverError && <div className="text-sm text-red-700">{serverError}</div>}

      <div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={submitting}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default UiForm;
