
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, ShieldCheck, Database, LayoutGrid, LogOut, Coins, Target, Languages } from 'lucide-react';
import { UserAccount, AppConfig, Language } from '../types';
import { t } from '../translations';

interface HeaderProps {
  user: UserAccount;
  config: AppConfig;
  lang: Language;
  setLang: (l: Language) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, config, lang, setLang, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: t(lang, 'discover'), icon: LayoutGrid },
    { path: '/broadcast', label: t(lang, 'broadcast'), icon: Radio },
    { path: '/michezo', label: t(lang, 'games'), icon: Target },
  ];

  const toggleLang = () => {
    setLang(lang === 'sw' ? 'en' : 'sw');
  };

  return (
    <header className="glass sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2 md:gap-3 group">
        <div 
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 shadow-lg cursor-pointer"
          style={{ backgroundColor: config.themeColor }}
        >
          <Radio className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm md:text-lg font-black text-white tracking-tighter leading-none">
            {config.appName}
          </h1>
          <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            BY {config.ownerName}
          </p>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-1 bg-slate-900/40 p-1 rounded-2xl border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive 
                ? 'bg-white/10 text-white shadow-inner' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher */}
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:bg-white/10 transition-all active:scale-95"
        >
          <Languages size={14} className="text-blue-500" />
          {lang === 'sw' ? 'SW' : 'EN'}
        </button>

        <Link to="/michezo" className="relative group">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-xl transition-all hover:bg-yellow-500/20 hover:scale-105 active:scale-95 cursor-pointer">
            <Coins size={16} className="text-yellow-500 animate-coin-rotate" />
            <span className="text-[10px] md:text-xs font-black text-yellow-500 leading-none">{user.coins}</span>
          </div>
        </Link>
        
        {(user.isAdmin || user.isSubAdmin) && (
          <div className="flex items-center gap-2">
            <Link to="/admin" className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-all border border-white/5">
              <ShieldCheck size={18} />
            </Link>
            <button 
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes coin-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-coin-rotate {
          animation: coin-rotate 3s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
