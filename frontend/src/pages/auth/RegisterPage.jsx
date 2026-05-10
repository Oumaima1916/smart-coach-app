import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

const getScore = (v) => [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
const LABELS = ["", "Faible", "Correct", "Bien", "Fort"];
const COLORS = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-green-400", "bg-green-500"];

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const score = getScore(form.password);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (form.password.length < 8)       { setError("Minimum 8 caracteres."); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-900 focus:bg-white transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">

        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Nouveau compte</p>
        <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-2">S'inscrire</h1>
        <p className="text-sm text-gray-400 mb-7">
          Deja inscrit ?{" "}
          <Link to="/login" className="text-gray-900 font-medium underline underline-offset-2">Se connecter</Link>
        </p>

        {error && (
          <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            <AlertIcon /> {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Nom complet</label>
            <input name="name" type="text" placeholder="Jean Dupont" value={form.name} onChange={onChange} required autoComplete="name" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Adresse email</label>
            <input name="email" type="email" placeholder="vous@email.com" value={form.email} onChange={onChange} required autoComplete="email" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input name="password" type={showPwd ? "text" : "password"} placeholder="8 caracteres minimum"
                value={form.password} onChange={onChange} required autoComplete="new-password"
                className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {form.password && (
              <>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`flex-1 h-0.5 rounded-full transition-colors ${i < score ? COLORS[score] : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{LABELS[score]}</p>
              </>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Confirmer le mot de passe</label>
            <input name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={onChange} required autoComplete="new-password" className={inputCls} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-2 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {loading ? <Spinner /> : "Creer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}

const AlertIcon  = () => <svg className="w-4 h-4 stroke-current shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const EyeIcon    = () => <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const Spinner    = () => <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;