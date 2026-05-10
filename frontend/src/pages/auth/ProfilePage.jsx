import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../services/authService";
import { loginSuccess }  from "../../store/authSlice";

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-gray-900 focus:bg-white transition-colors";

export default function ProfilePage() {
  const { user }  = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const fileRef   = useRef();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    email:     user?.email     || "",
    weight:    user?.weight    || "",
    height:    user?.height    || "",
    goal:      user?.goal      || "",
    currentPwd: "",
    newPwd:     "",
  });
  const [avatar, setAvatar]   = useState(user?.avatar || null);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);
    try {
      const updated = await updateProfile({ ...form, avatar });
      dispatch(loginSuccess({ user: updated, token: localStorage.getItem("token") }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Erreur de mise a jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">

        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Parametres</p>
        <h1 className="font-bold text-2xl tracking-tight text-gray-900 mb-7">Mon profil</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <UserIcon />}
          </div>
          <div>
            <p className="text-sm text-gray-500">Photo de profil</p>
            <button onClick={() => fileRef.current.click()} className="text-xs font-medium text-gray-900 underline underline-offset-2 mt-1 block">
              Modifier la photo
            </button>
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={onAvatar} />
          </div>
        </div>

        {error   && <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5"><AlertIcon /> {error}</div>}
        {success && <div className="flex gap-2 items-start bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5"><CheckIcon /> Profil mis a jour avec succes.</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Prenom</label>
              <input name="firstName" type="text" placeholder="Jean" value={form.firstName} onChange={onChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Nom</label>
              <input name="lastName" type="text" placeholder="Dupont" value={form.lastName} onChange={onChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Poids (kg)</label>
              <input name="weight" type="number" placeholder="75" min="30" max="300" value={form.weight} onChange={onChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Taille (cm)</label>
              <input name="height" type="number" placeholder="175" min="100" max="250" value={form.height} onChange={onChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Objectif principal</label>
            <select name="goal" value={form.goal} onChange={onChange} className={inputCls}>
              <option value="">Selectionner</option>
              <option value="perte">Perte de poids</option>
              <option value="muscle">Prise de muscle</option>
              <option value="cardio">Endurance / Cardio</option>
              <option value="forme">Forme generale</option>
            </select>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400">Changer le mot de passe</p>
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Mot de passe actuel</label>
              <input name="currentPwd" type="password" placeholder="••••••••" value={form.currentPwd} onChange={onChange} autoComplete="current-password" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-400 mb-1.5">Nouveau mot de passe</label>
              <input name="newPwd" type="password" placeholder="Laisser vide pour ne pas changer" value={form.newPwd} onChange={onChange} autoComplete="new-password" className={inputCls} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {loading ? <Spinner /> : "Sauvegarder"}
          </button>
        </form>
      </div>
    </div>
  );
}

const UserIcon  = () => <svg className="w-6 h-6 text-gray-300 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const AlertIcon = () => <svg className="w-4 h-4 stroke-current shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const CheckIcon = () => <svg className="w-4 h-4 stroke-current shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Spinner   = () => <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;