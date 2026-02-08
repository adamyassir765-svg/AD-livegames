
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, ChevronRight, BellRing, Radio, Sparkles, Coins, Zap, ShieldAlert, Smartphone, X, Download, Share, CheckCircle2 } from 'lucide-react';
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
  const [showInstallOverlay, setShowInstallOverlay] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIPhone, setIsIPhone] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect Standalone mode (if already installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    
    // Check for iPhone/iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIPhone(isIOS);

    // Show overlay if not already installed and not dismissed in this session
    if (!standalone) {
      const hasDismissed = sessionStorage.getItem('ad_stream_install_dismissed');
      if (!hasDismissed) {
        // Show immediately to get user's attention as requested
        setShowInstallOverlay(true);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Ensure overlay is shown when prompt is ready
      setShowInstallOverlay(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallOverlay(false);
      }
      setDeferredPrompt(null);
    } else if (isIPhone) {
      // iPhone instructions are handled by the UI
    } else {
      // Fallback: If no prompt, it might be because the browser doesn't support it or already dismissed
      alert(lang === 'sw' 
        ? "Sakinisha kupitia Menu ya Browser yako (Tatu dots) kisha 'Install App' au 'Add to Home Screen'." 
        : "Install via your Browser Menu (Three dots) then select 'Install App' or 'Add to Home Screen'.");
    }
  };

  const dismissOverlay = () => {
    setShowInstallOverlay(false);
    sessionStorage.setItem('ad_stream_install_dismissed', 'true');
  };

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-700">
      
      {/* PROFESSIONAL PWA INSTALL OVERLAY */}
      {showInstallOverlay && !isStandalone && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="max-w-md w-full relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-950 rounded-[48px] border-4 border-white/20 shadow-[0_0_100px_rgba(37,99,235,0.6)] p-8 md:p-12">
            {/* Design elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/30 blur-[80px] rounded-full -ml-20 -mt-20" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/30 blur-[80px] rounded-full -mr-20 -mb-20" />
            
            <button 
              onClick={dismissOverlay}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 space-y-10 text-center">
              <div className="w-28 h-28 bg-white rounded-[40px] mx-auto flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] rotate-3">
                <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center">
                  <Radio size={48} className="text-white animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  AD STREAM <span className="text-blue-400">APP</span>
                </h3>
                <p className="text-blue-100 text-sm md:text-base font-bold opacity-90 leading-relaxed px-4">
                  {isIPhone 
                    ? "Sakinisha AD Stream sasa ili uweze kurusha mechi na kutazama soka live kwa urahisi zaidi kwenye iPhone yako." 
                    : "Pakua App rasmi ya AD Stream uweze kurusha mechi zako na kupata matokeo ya soka popote ulipo!"}
                </p>
              </div>

              <div className="space-y-5">
                {isIPhone ? (
                  <div className="bg-black/30 p-8 rounded-[36px] border border-white/10 space-y-6 text-left">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">1</div>
                      <p className="text-xs md:text-sm font-black text-white uppercase tracking-wider flex items-center gap-3">
                        Gusa <Share size={20} className="text-blue-400" /> (Share Button) chini ya kioo.
                      </p>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">2</div>
                      <p className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                        Chagua 'Add to Home Screen'.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button 
                        onClick={dismissOverlay}
                        className="w-full bg-white text-blue-700 font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                      >
                        NIMELEWA, NGOJA NIFANYE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button 
                      onClick={handleInstallClick}
                      className="w-full bg-white text-blue-700 font-black py-7 rounded-[32px] text-xl uppercase tracking-widest hover:bg-blue-50 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 flex items-center justify-center gap-4 group"
                    >
                      <Download size={28} className="group-hover:translate-y-1 transition-transform" /> {t(lang, 'installButton')}
                    </button>
                    <button 
                      onClick={dismissOverlay}
                      className="w-full text-white/40 font-black text-[10px] uppercase tracking-[0.3em] py-2 hover:text-white transition-colors"
                    >
                      ENDELEA KWENYE BROWSER
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/5">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[10px] text-blue-200/50 font-black uppercase tracking-[0.2em]">Offical AD Stream PWA • Tanzania</span>
              </div>
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
