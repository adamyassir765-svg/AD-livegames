
import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  isAdmin: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isAdmin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Adam AD Portal</h2>
          <p className="text-slate-500 font-medium text-sm">Sehemu hii ni kwa ajili ya Admin Mkuu pekee.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ingiza Password ya Siri</label>
            <div className="relative">
              <input 
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-2xl py-5 pl-14 pr-6 text-white font-mono text-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all`}
              />
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 text-lg group"
          >
            INGIA KWENYE PANEL <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          SIRI YA ADAM AD • USIMPE MTU YEYOTE
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
