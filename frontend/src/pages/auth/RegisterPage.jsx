import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">{labels[score]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirm: '', terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Requis';
    if (!form.lastName.trim()) e.lastName = 'Requis';
    if (!form.email) e.email = 'E-mail requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail invalide';
    if (!form.password) e.password = 'Requis';
    else if (form.password.length < 8) e.password = 'Min. 8 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    if (!form.terms) e.terms = 'Vous devez accepter les conditions';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const result = await dispatch(registerUser({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    }));
    if (registerUser.fulfilled.match(result)) navigate('/login?registered=1');
  };

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [f]: val }));
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
     focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50
     ${fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg">SmartCoach</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Créer un compte</h1>
          <p className="text-sm text-gray-500 mb-6">Rejoignez SmartCoach dès aujourd'hui</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Prénom</label>
                <input type="text" value={form.firstName} onChange={set('firstName')}
                  placeholder="Jean" autoComplete="given-name" className={inputClass('firstName')} />
                {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Nom</label>
                <input type="text" value={form.lastName} onChange={set('lastName')}
                  placeholder="Dupont" autoComplete="family-name" className={inputClass('lastName')} />
                {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Adresse e-mail</label>
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="you@example.com" autoComplete="email" className={inputClass('email')} />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 caractères"
                  autoComplete="new-password"
                  className={`${inputClass('password')} pr-10`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Afficher/masquer">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.95 9.95 0 016.34 2.26M21 21L3 3" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass('confirm')}
              />
              {fieldErrors.confirm && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirm}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 mb-5">
              <input
                type="checkbox"
                id="terms"
                checked={form.terms}
                onChange={set('terms')}
                className="mt-0.5 w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                J'accepte les{' '}
                <Link to="/terms" className="text-indigo-600 hover:underline">Conditions d'utilisation</Link>
                {' '}et la{' '}
                <Link to="/privacy" className="text-indigo-600 hover:underline">Politique de confidentialité</Link>
              </label>
            </div>
            {fieldErrors.terms && <p className="text-xs text-red-500 -mt-3 mb-4">{fieldErrors.terms}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg
                hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}