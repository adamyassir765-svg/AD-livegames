
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Home from './views/Home';
import Broadcaster from './views/Broadcaster';
import Viewer from './views/Viewer';
import Admin from './views/Admin';
import AdminLogin from './views/AdminLogin';
import Paywall from './components/Paywall';
import WhatsAppButton from './components/WhatsAppButton';
import GameCenter from './views/GameCenter';
import MatchTicker from './components/MatchTicker';
import { UserAccount, AppConfig, Language, StreamSession } from './types';

const MainLayout: React.FC<{
  config: AppConfig;
  user: UserAccount;
  setUser: (u: UserAccount) => void;
  lang: Language;
  setLang: (l: Language) => void;
  onLogout: () => void;
  deductCoin: () => boolean;
  handleAdminLogin: (p: string) => boolean;
  handlePaymentRequest: (tid: string, c: number) => void;
  onConfigChange: (c: AppConfig) => void;
}> = ({ config, user, setUser, lang, setLang, onLogout, deductCoin, handleAdminLogin, handlePaymentRequest, onConfigChange }) => {
  const location = useLocation();
  const isViewerPage = location.pathname.startsWith('/watch/');
  const isRestricted = !user.isAdmin && !user.isSubAdmin;
  const [liveStreams, setLiveStreams] = useState<StreamSession[]>([]);
  
  const showHeader = !(isViewerPage && isRestricted);

  useEffect(() => {
    const updateStreams = () => {
      const activeMatchStr = localStorage.getItem('gs_active_match');
      if (activeMatchStr) {
        try {
          const match = JSON.parse(activeMatchStr);
          if (match && match.isLive) {
            setLiveStreams([match]);
          } else {
            setLiveStreams([]);
          }
        } catch (e) {
          setLiveStreams([]);
        }
      } else {
        setLiveStreams([]);
      }
    };
    updateStreams();
    window.addEventListener('storage', updateStreams);
    const interval = setInterval(updateStreams, 3000);
    return () => {
      window.removeEventListener('storage', updateStreams);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen gradient-bg text-slate-200 flex flex-col">
      {showHeader && <Header config={config} user={user} lang={lang} setLang={setLang} onLogout={onLogout} />}
      
      <main className={`flex-1 container mx-auto px-4 ${showHeader ? 'py-8' : 'h-screen flex flex-col'} max-w-7xl pb-32`}>
        <Routes>
          <Route path="/" element={<Home config={config} user={user} lang={lang} />} />
          <Route path="/michezo" element={
            user.isAdmin || user.isSubAdmin || user.coins > 0 
              ? <GameCenter user={user} setUser={setUser} config={config} lang={lang} />
              : <Paywall config={config} user={user} lang={lang} onSubmitPayment={handlePaymentRequest} />
          } />
          <Route path="/broadcast" element={
            user.isAdmin || user.isSubAdmin || user.coins > 0 
              ? <Broadcaster user={user} onDeductCoin={deductCoin} lang={lang} />
              : <Paywall config={config} user={user} lang={lang} onSubmitPayment={handlePaymentRequest} />
          } />
          <Route path="/watch/:streamId" element={<Viewer config={config} user={user} lang={lang} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} isAdmin={user.isAdmin} />} />
          <Route path="/admin" element={
            user.isAdmin || user.isSubAdmin
              ? <Admin config={config} onConfigChange={onConfigChange} user={user} onUserChange={(u) => {}} />
              : <Navigate to="/admin-login" />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <MatchTicker streams={liveStreams} lang={lang} />
      {showHeader && <WhatsAppButton config={config} />}
    </div>
  );
};

const App: React.FC = () => {
  const CONFIG_KEY = 'gs_admin_config_v11';
  const USER_KEY = 'gs_user_acc_v11';
  const LANG_KEY = 'gs_lang_v11';

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(LANG_KEY) as Language) || 'sw';
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      return saved ? JSON.parse(saved) : getDefaultConfig();
    } catch (e) {
      return getDefaultConfig();
    }
  });

  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const isAdminAuthenticated = localStorage.getItem('gs_admin_auth') === 'true';
      const isSubAdminAuthenticated = localStorage.getItem('gs_subadmin_auth') === 'true';

      if (isAdminAuthenticated) return getAdminUser();
      if (isSubAdminAuthenticated) return getSubAdminUser();

      const saved = localStorage.getItem(USER_KEY);
      if (!saved) {
        return createNewUser();
      }
      return JSON.parse(saved);
    } catch (e) {
      return createNewUser();
    }
  });

  function createNewUser(): UserAccount {
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      username: 'Shabiki-' + Math.floor(Math.random() * 9999),
      coins: 2,
      status: 'active',
      expiryDate: '2025-12-31',
      isSubAdmin: false,
      isAdmin: false
    };
  }

  function getDefaultConfig(): AppConfig {
    return {
      appName: 'AD STREAM',
      appTagline: 'eFootball Live Tanzania • Adam AD',
      ownerName: 'Adam AD',
      currency: 'TZS',
      paymentNumber: '0792414837',
      paymentName: 'MRISHO', 
      themeColor: '#2563eb',
      autoApprove: true,
      whatsappSupport: '255792414837',
      whatsappChannel: 'https://whatsapp.com/channel/example',
      coinPackages: [
        { id: '1', amount: 3, price: 2000 },
        { id: '2', amount: 10, price: 5000 },
        { id: '3', amount: 100, price: 35000 }
      ],
      ads: [
        { id: 'ad1', title: 'Pata Coins za Bure @ AD STREAM!', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800', whatsappNumber: '255792414837' }
      ]
    };
  }

  function getAdminUser(): UserAccount {
    return {
      id: 'admin-adam',
      username: 'Adam AD (Owner)',
      coins: 999999,
      status: 'active',
      expiryDate: '2099-12-31',
      isSubAdmin: false,
      isAdmin: true
    };
  }

  function getSubAdminUser(): UserAccount {
    return {
      id: 'sub-admin-' + Math.random().toString(36).substr(2, 5),
      username: 'Sub-Admin',
      coins: 10,
      status: 'active',
      expiryDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      isSubAdmin: true,
      isAdmin: false
    };
  }

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const handleAdminLogin = (password: string) => {
    if (password === 'adam2025') {
      const admin = getAdminUser();
      localStorage.setItem('gs_admin_auth', 'true');
      localStorage.removeItem('gs_subadmin_auth');
      setUser(admin);
      return true;
    }
    if (password === 'sub2025') {
      const sub = getSubAdminUser();
      localStorage.setItem('gs_subadmin_auth', 'true');
      localStorage.removeItem('gs_admin_auth');
      setUser(sub);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('gs_admin_auth');
    localStorage.removeItem('gs_subadmin_auth');
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  };

  const handlePaymentRequest = (transactionId: string, requestedCoins: number) => {
    if (transactionId.length > 5) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + requestedCoins,
        status: 'active'
      }));
      alert(`MALIPO YAMEHAKIKIWA! Coin ${requestedCoins} zimeongezwa.`);
    }
  };

  const deductCoin = () => {
    if (user.isAdmin || user.isSubAdmin) return true;
    if (user.coins > 0) {
      setUser(prev => ({ ...prev, coins: prev.coins - 1 }));
      return true;
    }
    return false;
  };

  const handleConfigChange = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  return (
    <HashRouter>
      <MainLayout 
        config={config} 
        user={user} 
        setUser={setUser}
        lang={lang}
        setLang={setLang}
        onLogout={handleLogout} 
        deductCoin={deductCoin} 
        handleAdminLogin={handleAdminLogin} 
        handlePaymentRequest={handlePaymentRequest}
        onConfigChange={handleConfigChange}
      />
    </HashRouter>
  );
};

export default App;
