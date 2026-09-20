import React, { useState, useEffect } from 'react';
import { auth, servicesApi, advertisementsApi } from './lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import type { ServiceItem, AdvertisementItem } from './types';
import { Shield, Check, X, LogOut, Loader2 } from 'lucide-react';

export const AdminApp = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingServices, setPendingServices] = useState<ServiceItem[]>([]);
  const [pendingAds, setPendingAds] = useState<AdvertisementItem[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) loadData();
    });
    return () => unsub();
  }, []);

  const loadData = async () => {
    const s = await servicesApi.getAll();
    setPendingServices(s.filter((x) => !x.verified));
    const a = await advertisementsApi.getAll();
    setPendingAds(a.filter((x) => x.status === 'pending' || !x.isApproved));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Email or password is incorrect.');
    }
    setLoginLoading(false);
  };

  const approveService = async (id: string) => { await servicesApi.updateVerification(id, true); loadData(); };
  const rejectService = async (id: string) => { await servicesApi.delete(id); loadData(); };
  const approveAd = async (id: string) => { await advertisementsApi.updateStatus(id, 'approved'); loadData(); };
  const rejectAd = async (id: string) => { await advertisementsApi.updateStatus(id, 'rejected'); loadData(); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4" dir="rtl">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none" dir="ltr" />
          </div>
          <button type="submit" disabled={loginLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50">
            {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={() => signOut(auth)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">{pendingServices.length}</span>
              Pending Services
            </h2>
            {pendingServices.length === 0 ? (
              <p className="text-slate-400">No pending services.</p>
            ) : (
              <div className="grid gap-4">
                {pendingServices.map((s) => (
                  <div key={s.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h3 className="font-bold text-lg">{s.name.ar} - {s.tradeOrRole.ar}</h3>
                      <p className="text-sm text-slate-400" dir="ltr">{s.phone}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => approveService(s.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => rejectService(s.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">{pendingAds.length}</span>
              Pending Ads
            </h2>
            {pendingAds.length === 0 ? (
              <p className="text-slate-400">No pending ads.</p>
            ) : (
              <div className="grid gap-4">
                {pendingAds.map((a) => (
                  <div key={a.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-4 items-center">
                      {a.imageUrl && <img src={a.imageUrl} alt="Ad" className="w-16 h-16 rounded-lg object-cover bg-slate-700" />}
                      <div>
                        <h3 className="font-bold text-lg">{a.title.ar}</h3>
                        <p className="text-sm text-slate-400" dir="ltr">{a.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => approveAd(a.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => rejectAd(a.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
