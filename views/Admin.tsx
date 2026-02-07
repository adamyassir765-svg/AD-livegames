
import React, { useState } from 'react';
// Added missing Coins import
import { Settings, Save, Users, ArrowLeft, RefreshCw, Smartphone, CheckCircle, Plus, Megaphone, ImageIcon, Crown, Radio, Clock, AlertTriangle, Trash2, Edit3, DollarSign, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppConfig, UserAccount, AdItem, CoinPackage } from '../types';

interface AdminProps {
  config: AppConfig;
  onConfigChange: (config: AppConfig) => void;
  user: UserAccount;
  onUserChange: (user: UserAccount) => void;
}

const Admin: React.FC<AdminProps> = ({ config, onConfigChange, user, onUserChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'subadmins' | 'ads' | 'packages' | 'settings'>('requests');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  
  // State kwa ajili ya kuongeza tangazo jipya
  const [newAd, setNewAd] = useState<Partial<AdItem>>({ 
    id: '', 
    title: '', 
    imageUrl: '', 
    whatsappNumber: config.whatsappSupport 
  });

  const handleSaveConfig = () => {
    onConfigChange(localConfig);
    // Hapa tunasave kwenye localStorage ambayo inawakilisha database ya muda
    localStorage.setItem('gs_admin_config_v11', JSON.stringify(localConfig));
    alert("MABADILIKO YAMEHIFADHIWA! Sasa watumiaji wote wataona taarifa hizi mpya.");
  };

  const addAd = () => {
    if (!newAd.title || !newAd.imageUrl) return alert("Jaza kichwa cha habari na link ya picha!");
    const adToAdd = { ...newAd, id: Date.now().toString() } as AdItem;
    const updatedAds = [...localConfig.ads, adToAdd];
    const newConf = { ...localConfig, ads: updatedAds };
    setLocalConfig(newConf);
    setNewAd({ id: '', title: '', imageUrl: '', whatsappNumber: config.whatsappSupport });
  };

  const deleteAd = (id: string) => {
    const updatedAds = localConfig.ads.filter(a => a.id !== id);
    setLocalConfig({ ...localConfig, ads: updatedAds });
  };

  const updatePackagePrice = (id: string, newPrice: number) => {
    const updatedPkgs = localConfig.coinPackages.map(p => 
      p.id === id ? { ...p, price: newPrice } : p
    );
    setLocalConfig({ ...localConfig, coinPackages: updatedPkgs });
  };

  // View kwa ajili ya Sub-Admin (Imebaki kama ilivyokuwa)
  if (user.isSubAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Panel ya <span className="text-blue-500">Sub-Admin</span></h2>
              <p className="text-slate-500 text-sm">Karibu {user.username}, dhibiti michezo yako hapa.</p>
           </div>
           <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white transition-all">
              <ArrowLeft size={24} />
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div onClick={() => navigate('/broadcast')} className="glass p-10 rounded-[40px] border-2 border-blue-600/30 hover:border-blue-600 transition-all cursor-pointer group bg-blue-600/5 shadow-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Radio size={32} className="text-white" /></div>
              <h3 className="text-2xl font-black text-white uppercase mb-2">Rusha Mechi</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Anza kurusha mechi za eFootball Live sasa.</p>
           </div>
           <div className="glass p-10 rounded-[40px] border-2 border-yellow-500/30 bg-yellow-500/5 shadow-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6"><Clock size={32} className="text-black" /></div>
              <h3 className="text-2xl font-black text-white uppercase mb-2">Hali ya Coins</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-xs font-black text-slate-500 uppercase">Zilizobaki</span><span className="text-xl font-black text-yellow-500">{user.coins}</span></div>
                 <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex gap-3">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0" /><p className="text-[10px] text-red-400 font-bold leading-tight">Coins zikiisha mechi zitakatika. Nunua kwa Adam AD.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // View kamili ya Adam AD (Owner)
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-4 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Control <span className="text-blue-500">Center</span></h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{localConfig.ownerName} - Dashboard ya Kidijitali</p>
        </div>
        <div className="flex gap-3">
           <button onClick={handleSaveConfig} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-xl transition-all active:scale-95">
              <Save size={16} /> HIFADHI KILA KITU
           </button>
           <button onClick={() => navigate('/')} className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-4 rounded-2xl transition-all">
              <ArrowLeft size={20} />
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-white/5 w-fit overflow-x-auto scrollbar-hide">
        {[
          { id: 'requests', label: 'Malipo', icon: RefreshCw },
          { id: 'ads', label: 'Ads (Matangazo)', icon: Megaphone },
          { id: 'packages', label: 'Bei za Coins', icon: DollarSign },
          { id: 'settings', label: 'Mipangilio', icon: Settings },
          { id: 'subadmins', label: 'Sub-Admins', icon: Crown },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-black text-[10px] whitespace-nowrap transition-all uppercase flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Ads Management */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
           <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
              <h3 className="font-black text-white text-xl uppercase tracking-tighter flex items-center gap-2">
                 <Plus className="text-blue-500" /> Ongeza Tangazo Jipya
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <input 
                   type="text" 
                   placeholder="Kichwa cha Tangazo (mf: Bet na Adam AD)" 
                   className="bg-black/40 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                   value={newAd.title}
                   onChange={e => setNewAd({...newAd, title: e.target.value})}
                 />
                 <input 
                   type="text" 
                   placeholder="Link ya Picha (URL)" 
                   className="bg-black/40 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-blue-500"
                   value={newAd.imageUrl}
                   onChange={e => setNewAd({...newAd, imageUrl: e.target.value})}
                 />
                 <button onClick={addAd} className="bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-500 transition-all">ONGEZA TANGAZO</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localConfig.ads.map(ad => (
                 <div key={ad.id} className="glass rounded-3xl overflow-hidden border border-white/10 group relative">
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-40 object-cover opacity-60" />
                    <div className="p-4 bg-slate-900/90">
                       <h4 className="text-white font-black text-xs uppercase truncate">{ad.title}</h4>
                       <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] text-slate-500 font-bold">{ad.whatsappNumber}</span>
                          <button onClick={() => deleteAd(ad.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Tab: Packages Management */}
      {activeTab === 'packages' && (
        <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8">
           <h3 className="font-black text-white text-2xl uppercase tracking-tighter">Dhibiti Bei za Coins</h3>
           <div className="grid md:grid-cols-3 gap-6">
              {localConfig.coinPackages.map(pkg => (
                 <div key={pkg.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-3xl font-black text-white">{pkg.amount} <span className="text-xs text-slate-500">COINS</span></span>
                       <Coins className="text-yellow-500" size={24} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase">Bei (TZS)</label>
                       <input 
                         type="number" 
                         value={pkg.price} 
                         onChange={e => updatePackagePrice(pkg.id, parseInt(e.target.value))}
                         className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-green-500 font-black text-xl outline-none"
                       />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Tab: Main Settings */}
      {activeTab === 'settings' && (
        <div className="glass p-10 rounded-[40px] border border-white/5 space-y-10 shadow-2xl">
           <div className="border-b border-white/5 pb-6">
              <h3 className="font-black text-white text-2xl uppercase tracking-tighter">Taarifa za Malipo & Support</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Namba ya M-Pesa/Tigo Pesa</label>
                 <input type="text" value={localConfig.paymentNumber} onChange={e => setLocalConfig({...localConfig, paymentNumber: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jina la Mpokeaji (Lite)</label>
                 <input type="text" value={localConfig.paymentName} onChange={e => setLocalConfig({...localConfig, paymentName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Support Number</label>
                 <input type="text" value={localConfig.whatsappSupport} onChange={e => setLocalConfig({...localConfig, whatsappSupport: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jina la App (Branding)</label>
                 <input type="text" value={localConfig.appName} onChange={e => setLocalConfig({...localConfig, appName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-500" />
              </div>
           </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
             <h3 className="font-black text-white text-xl uppercase tracking-tighter">Maombi ya Uhakiki wa Coins</h3>
             <button className="text-blue-500 hover:text-blue-400 transition-all"><RefreshCw size={20}/></button>
          </div>
          <div className="p-20 text-center text-slate-500 font-bold uppercase text-xs tracking-widest flex flex-col items-center gap-4">
             <CheckCircle size={48} className="text-slate-800" />
             Kila kitu kiko sawa. Hakuna maombi ya malipo yanayosubiri.
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
