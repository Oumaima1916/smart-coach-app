import { useState } from "react";
import { Link } from "react-router-dom";
import { requestReset, verifyCode, resetPassword } from "../../services/authService";

const STEPS = ["email", "code", "newpwd", "done"];

export default function ForgotPasswordPage() {
  const [step, setStep]       = useState("email");
  const [email, setEmail]     = useState("");
  const [code, setCode]       = useState("");
  const [newPwd, setNewPwd]   = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const stepIdx = STEPS.indexOf(step);
  const go = async (fn) => {
    setError(null);
    setLoading(true);
    try { await fn(); } catch (e) { setError(e.message || "Erreur."); } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-900 focus:bg-white transition-colors";
  const btnCls   = "w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">

        {step !== "done" && (
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-6">
            <ChevronLeft /> Retour
          </Link>
        )}

        {step !== "done" && (
          <div className="flex gap-1.5 mb-6">
            {["email", "code", "newpwd"].map((s, i) => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${i <= stepIdx ? "bg-gray-900" : "bg-gray-200"} ${i === stepIdx ? "w-6" : "w-2"}`} />
            ))}
          </div>
        )}

        {error && (
          <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            <AlertIcon /> {error}
          </div>
        )}

        {step === "email" && (
          <>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Etape 1 / 3</p>
            <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-2">Mot de passe oublie</h1>
            <p className="text-sm text-gray-400 mb-7">Entrez votre email pour recevoir un code de verification.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Adresse email</label>
                <input type="email" placeholder="vous@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <button onClick={() => go(async () => { await requestReset(email); setStep("code"); })} disabled={loading || !email} className={btnCls}>
                {loading ? <Spinner /> : "Envoyer le code"}
              </button>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Etape 2 / 3</p>
            <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-2">Verifiez vos emails</h1>
            <p className="text-sm text-gray-400 mb-7">Code envoye a <span className="font-medium text-gray-700">{email}</span>.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Code a 6 chiffres</label>
                <input type="text" placeholder="123456" maxLength={6} inputMode="numeric"
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`${inputCls} text-center text-xl tracking-[0.5em]`} />
              </div>
              <button onClick={() => go(async () => { await verifyCode(email, code); setStep("newpwd"); })} disabled={loading || code.length < 4} className={btnCls}>
                {loading ? <Spinner /> : "Verifier"}
              </button>
              <button onClick={() => requestReset(email)} className="w-full py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
                Renvoyer le code
              </button>
            </div>
          </>
        )}

        {step === "newpwd" && (
          <>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Etape 3 / 3</p>
            <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-2">Nouveau mot de passe</h1>
            <p className="text-sm text-gray-400 mb-7">Choisissez un mot de passe securise.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Nouveau mot de passe</label>
                <input type="password" placeholder="8 caracteres minimum" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Confirmer</label>
                <input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
              </div>
              <button
                onClick={() => go(async () => {
                  if (newPwd !== confirm) throw new Error("Mots de passe differents.");
                  if (newPwd.length < 8)  throw new Error("Minimum 8 caracteres.");
                  await resetPassword(email, code, newPwd);
                  setStep("done");
                })}
                disabled={loading || !newPwd} className={btnCls}>
                {loading ? <Spinner /> : "Reinitialiser"}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <CheckIcon />
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-2">Mot de passe mis a jour</h1>
            <p className="text-sm text-gray-400 mb-7">Vous pouvez maintenant vous connecter.</p>
            <Link to="/login" className="flex items-center justify-center w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const ChevronLeft = () => <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const AlertIcon   = () => <svg className="w-4 h-4 stroke-current shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const CheckIcon   = () => <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Spinner     = () => <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;