
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, ChevronRight, BellRing, Radio, Sparkles, Coins, Zap, ShieldAlert, Smartphone, X, Download } from 'lucide-react';
import { StreamSession, AppConfig, UserAccount, Language } from '../types';
import AdTicker from '../components/AdTicker';
import GlobalChat from '../components/GlobalChat';
import { t } from '../translations';

interface HomeProps {
  config: AppConfig;
  user: UserAccount;
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ config, user, lang }) => {
  const navigate = useNavigate();
  const [activeMatch, setActiveMatch] = useState<StreamSession | null>(null);
  const [showInstallTip, setShowInstallTip] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    // Detect if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    // Check for iPhone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIPhone(isIOS);

    if (!isStandalone) {
      const hasDismissed = localStorage.getItem('gs_install_dismissed');
      if (!hasDismissed) {
        setShowInstallTip(true);
      }
    }

    // Capture the install prompt for Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallTip(true);
    });

    const checkActiveMatch = () => {
      try {
        const saved = localStorage.getItem('gs_active_match');
        if (saved) {
          setActiveMatch(JSON.parse(saved));
        } else {
          setActiveMatch(null);
        }
      } catch (e) {
        setActiveMatch(null);
      }
    };
    checkActiveMatch();
    const interval = setInterval(checkActiveMatch, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallTip(false);
      }
      setDeferredPrompt(null);
    } else if (isIPhone) {
      alert(t(lang, 'iphoneTip'));
    }
  };

  const dismissInstallTip = () => {
    setShowInstallTip(false);
    localStorage.setItem('gs_install_dismissed', 'true');
  };

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-700">
      {/* Enhanced PWA Install Banner */}
      {showInstallTip && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-[32px] border-4 border-white/20 shadow-2xl animate-in slide-in-from-top-full duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="bg-white p-3 rounded-2xl shadow-xl flex-shrink-0">
                <Smartphone size={32} className="text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                  {t(lang, 'installApp')}
                </h4>
                <p className="text-blue-100 text-xs font-medium max-w-xs">
                  {t(lang, 'installDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={handleInstallClick}
                className="flex-1 sm:flex-none bg-white text-blue-700 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Download size={18} /> {t(lang, 'installButton')}
              </button>
              <button 
                onClick={dismissInstallTip} 
                className="p-4 bg-black/20 hover:bg-black/40 rounded-2xl text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full -mt-4">
        <AdTicker ads={config.ads} />
      </div>

      {/* Hero Section */}
      <section className="relative glass rounded-[32px] md:rounded-[50px] p-8 md:p-20 overflow-hidden border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="absolute top-0 right-0 w-full md:w-[700px] h-full md:h-[700px] bg-blue-600/10 blur-[150px] -z-10 rounded-full" />
        
        <div className="max-w-3xl space-y-8 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-blue-500/20">
            <Trophy size={16} /> {t(lang, 'officialStream')}
          </div>
          <h2 className="text-5xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase">
            {t(lang, 'heroTitle1')} <span className="text-blue-600">{t(lang, 'heroTitle2')}</span><br className="hidden md:block"/>
            AD <span className="text-indigo-500 underline decoration-indigo-500/30">STREAM.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
            {t(lang, 'heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigate('/broadcast')}
              className="px-10 md:px-14 py-6 rounded-[32px] font-black text-xl transition-all shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-white bg-blue-600"
            >
              {t(lang, 'rushaMechi')} <ChevronRight size={24} />
            </button>
            <button 
               onClick={() => window.open(config.whatsappChannel, '_blank')}
               className="px-10 py-6 rounded-[32px] font-black text-xl transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2"
            >
               <BellRing size={22} /> {t(lang, 'joinChannel')}
            </button>
          </div>
        </div>
      </section>

      {/* Game Center Promo */}
      <section className="px-1">
         <div 
           onClick={() => navigate('/michezo')}
           className="relative overflow-hidden glass p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-4 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group hover:scale-[1.01] transition-all shadow-[0_0_60px_rgba(234,179,8,0.15)]"
         >
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-950 rounded-[32px] border-4 border-yellow-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Coins size={60} className="text-yellow-500 animate-pulse" />
               </div>
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/30">
                     <ShieldAlert size={12} /> {t(lang, 'requiredCoins')}
                  </div>
                  <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                     {t(lang, 'luckGame')}
                  </h3>
                  <p className="text-slate-400 font-bold md:text-xl uppercase tracking-widest text-xs">{t(lang, 'penaltyGame')}</p>
               </div>
            </div>
            <button className="w-full md:w-auto px-12 py-6 bg-yellow-500 text-black font-black text-xl rounded-[24px] shadow-2xl flex items-center justify-center gap-3 transition-all">
               {t(lang, 'playNow')} <Zap size={24} className="fill-black" />
            </button>
         </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center gap-5 border-b border-white/5 pb-8">
            <div className="w-3 h-10 bg-blue-600 rounded-full" />
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{t(lang, 'liveMatches')}</h3>
          </div>
          
          <div className="space-y-8">
            {activeMatch && (
              <div 
                onClick={() => navigate(`/watch/${activeMatch.id}`)}
                className="glass p-8 rounded-[40px] border-4 border-blue-600 bg-blue-600/5 cursor-pointer hover:bg-blue-600/10 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center border-2 border-blue-600">
                     <Radio size={40} className="text-blue-500 animate-pulse" />
                     <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-ping">LIVE</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-white text-xl md:text-3xl uppercase tracking-tighter leading-tight">{activeMatch.gameTitle}</h4>
                    <p className="text-slate-400 font-bold text-sm md:text-lg">{activeMatch.broadcasterName}</p>
                  </div>
                </div>
                <ChevronRight size={28} className="text-blue-600" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-8">
           <GlobalChat user={user} config={config} lang={lang} />
        </div>
      </div>
    </div>
  );
};

export default Home;
