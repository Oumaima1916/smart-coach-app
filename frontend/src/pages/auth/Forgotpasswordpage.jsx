import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const validate = () => {
    if (!email) return 'E-mail requis';
    if (!/\S+@\S+\.\S+/.test(email)) return 'E-mail invalide';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFieldError(err); return; }
    setFieldError('');
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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

          {!sent ? (
            <>
              {/* Icon */}
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-1">Mot de passe oublié ?</h1>
              <p className="text-sm text-gray-500 mb-6">
                Entrez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
                      focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50
                      ${fieldError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
                </div>

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
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h1 className="text-xl font-semibold text-gray-900 mb-1">Vérifiez votre boîte mail</h1>
              <p className="text-sm text-gray-500 mb-2">
                Un lien de réinitialisation a été envoyé à
              </p>
              <p className="text-sm font-medium text-gray-900 mb-6">{email}</p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-500 mb-6">
                Le lien expire dans <span className="font-medium text-gray-700">15 minutes</span>. Vérifiez aussi vos spams.
              </div>

              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg
                  hover:bg-gray-50 transition-colors"
              >
                Renvoyer un lien
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-5">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}