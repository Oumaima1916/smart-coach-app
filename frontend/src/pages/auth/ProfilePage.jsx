import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../../store/authSlice';
import { getProfile, updateProfile } from '../../services/authService';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1,
  }).format(number);
}

function calculateBmi(weight, height) {
  const weightKg = Number(weight);
  const heightCm = Number(height);

  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user: storedUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    weight: '',
    height: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initials = useMemo(() => {
    const first = (form.firstName || storedUser?.firstName || '?').trim().charAt(0);
    const last = (form.lastName || storedUser?.lastName || '').trim().charAt(0);
    return `${first}${last}`.toUpperCase();
  }, [form.firstName, form.lastName, storedUser?.firstName, storedUser?.lastName]);

  const bmi = useMemo(
    () => calculateBmi(form.weight || storedUser?.weight, form.height || storedUser?.height),
    [form.weight, form.height, storedUser?.weight, storedUser?.height]
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    let active = true;

    async function loadProfile() {
      try {
        const data = await getProfile(token);
        if (!active) return;

        const profile = data.user;
        setForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          weight: profile.weight ?? '',
          height: profile.height ?? '',
          password: '',
          confirmPassword: '',
        });
        dispatch(setUser(profile));
      } catch (err) {
        if (!active) return;

        if (String(err.message || '').toLowerCase().includes('authentication required')) {
          dispatch(logout());
          navigate('/login');
          return;
        }

        setError(err.message || 'Impossible de charger le profil.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [dispatch, navigate, token]);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = 'Le prénom est requis.';
    if (!form.lastName.trim()) nextErrors.lastName = 'Le nom est requis.';
    if (!form.email.trim()) nextErrors.email = 'L’e-mail est requis.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'L’e-mail est invalide.';

    if (form.weight !== '' && (!Number.isFinite(Number(form.weight)) || Number(form.weight) <= 0)) {
      nextErrors.weight = 'Le poids doit être un nombre positif.';
    }

    if (form.height !== '' && (!Number.isFinite(Number(form.height)) || Number(form.height) <= 0)) {
      nextErrors.height = 'La taille doit être un nombre positif.';
    }

    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    if (form.password && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setError(Object.values(nextErrors)[0]);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        weight: form.weight === '' ? null : Number(form.weight),
        height: form.height === '' ? null : Number(form.height),
      };

      if (form.password) {
        payload.password = form.password;
      }

      const data = await updateProfile(token, payload);
      dispatch(setUser(data.user));
      setSuccess('Votre profil a été mis à jour.');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.message || 'La mise à jour a échoué.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-9rem)] px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-semibold text-white shadow-lg shadow-emerald-200">
              {initials || '?'}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Profile</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {form.firstName || storedUser?.firstName || 'Votre compte'}
              </h1>
              <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
            </div>
          </div>

              <div className="space-y-4 rounded-2xl bg-white/90 p-4 ring-1 ring-emerald-100">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">E-mail</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{form.email || storedUser?.email || '—'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Poids</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatNumber(form.weight || storedUser?.weight)} kg
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Taille</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatNumber(form.height || storedUser?.height)} cm
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">IMC</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {bmi ? bmi.toFixed(1) : '—'}
              </p>
              {bmi && (
                <p className="mt-1 text-xs text-gray-500">
                  {bmi < 18.5
                    ? 'Insuffisance pondérale'
                    : bmi < 25
                      ? 'Corpulence normale'
                      : bmi < 30
                        ? 'Surpoids'
                        : 'Obésité'}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Membre depuis</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(storedUser?.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Statut</p>
              <p className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Compte actif
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-900 p-4 text-sm text-gray-200">
            <p className="font-semibold text-white">Conseil rapide</p>
            <p className="mt-2 leading-6 text-gray-300">
              Gardez votre profil à jour pour recevoir des recommandations plus pertinentes sur vos programmes.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              to="/workout"
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Retour aux workouts
            </Link>
          </div>
        </aside>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Account settings</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Modifier votre profil</h2>
              <p className="mt-2 text-sm text-gray-500">
                Mettez à jour vos coordonnées et changez votre mot de passe si besoin.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
              </div>
              <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Prénom</span>
                  <input
                    value={form.firstName}
                    onChange={onChange('firstName')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Jean"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Nom</span>
                  <input
                    value={form.lastName}
                    onChange={onChange('lastName')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Dupont"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>E-mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="you@example.com"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Poids (kg)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.weight}
                    onChange={onChange('weight')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ex: 72.5"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Taille (cm)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.height}
                    onChange={onChange('height')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ex: 175"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Nouveau mot de passe</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={onChange('password')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Laissez vide pour ne rien changer"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Confirmer le mot de passe</span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={onChange('confirmPassword')}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Confirmez le nouveau mot de passe"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}