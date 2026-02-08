import React, { useState, useRef } from 'react';
import { Settings, Save, Users, ArrowLeft, RefreshCw, Smartphone, CheckCircle, Plus, Megaphone, ImageIcon, Crown, Radio, Clock, AlertTriangle, Trash2, Edit3, DollarSign, Coins, Upload, Image as ImageIconLucide, X } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'ads' | 'packages' | 'settings'>('requests');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  
  const [newAd, setNewAd] = useState<Partial<AdItem>>({ 
    id: '', 
    title: '', 
    imageUrl: '', 
    whatsappNumber: config.whatsappSupport 
  });

  const handleSaveConfig = () => {
    onConfigChange(localConfig);
    localStorage.setItem('gs_admin_config_v11', JSON.stringify(localConfig));
    alert("MABADILIKO YAMEHIFADHIWA! Sasa watumiaji wote wataona taarifa hizi mpya.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) { // Limit 1.5MB for storage safety
        alert("Picha ni kubwa sana! Tafadhali chagua picha iliyo chini ya 1.5MB ili isikwamishe App.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAd(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addAd = () => {
    if (!newAd.title || !newAd.imageUrl) return alert("Tafadhali jaza kichwa cha habari na uchague picha kwanza!");
    const adToAdd = { ...newAd, id: Date.now().toString() } as AdItem;
    const updatedAds = [adToAdd, ...localConfig.ads];
    const newConf = { ...localConfig, ads: updatedAds };
    setLocalConfig(newConf);
    setNewAd({ id: '', title: '', imageUrl: '', whatsappNumber: config.whatsappSupport });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteAd = (id: string) => {
    if(window.confirm("Je, una uhakika unataka kufuta tangazo hili?")) {
      const updatedAds = localConfig.ads.filter(a => a.id !== id);
      setLocalConfig({ ...localConfig, ads: updatedAds });
    }
  };

  const updatePackagePrice = (id: string, newPrice: number) => {
    const updatedPkgs = localConfig.coinPackages.map(p => 
      p.id === id ? { ...p, price: newPrice } : p
    );
    setLocalConfig({ ...localConfig, coinPackages: updatedPkgs });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Panel ya <span className="text-blue-500">Admin</span></h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Karibu {user.username}</p>
          </div>
        </div>
        <button 
          onClick={handleSaveConfig}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        >
          <Save size={20} /> HIFADHI MABADILIKO
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto p-1 bg-slate-900/50 rounded-3xl border border-white/5 no-scrollbar">
        {[
          { id: 'requests', label: 'Maombi', icon: Clock },
          { id: 'ads', label: 'Matangazo', icon: Megaphone },
          { id: 'packages', label: 'Bei za Coin', icon: DollarSign },
          { id: 'settings', label: 'Mpangilio', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-[40px] p-8 md:p-12 border border-white/5 min-h-[500px]">
        {activeTab === 'requests' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Maombi ya Coin</h3>
              <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase">
                <AlertTriangle size={14} /> Hakiki malipo kabla ya kuongeza
              </div>
            </div>
            <div className="text-center py-20 opacity-30 space-y-4">
              <RefreshCw size={48} className="mx-auto" />
              <p className="font-black uppercase tracking-widest text-sm">Hakuna maombi mapya kwa sasa</p>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Ongeza Tangazo Jipya</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Kichwa cha Tangazo</label>
                    <input 
                      value={newAd.title} 
                      onChange={e => setNewAd({...newAd, title: e.target.value})}
                      placeholder="Mfano: Pata Coin za Bure hapa!"
                      className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Picha ya Tangazo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    
                    {!newAd.imageUrl ? (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-all group"
                      >
                        <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ImageIconLucide size={32} className="text-blue-500" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bonyeza Kuchagua Picha</span>
                      </button>
                    ) : (
                      <div className="relative aspect-video rounded-3xl overflow-hidden group">
                        <img src={newAd.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button 
                            onClick={() => setNewAd({...newAd, imageUrl: ''})}
                            className="bg-red-600 text-white p-4 rounded-full shadow-2xl"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">PICHA TAYARI</div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={addAd}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl text-lg shadow-xl transition-all flex items-center justify-center gap-3"
                  >
                    <Plus size={24} /> WEKA TANGAZO SASA
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Orodha ya Matangazo</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {localConfig.ads.map(ad => (
                    <div key={ad.id} className="glass p-5 rounded-3xl border border-white/5 flex gap-4 items-center group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={ad.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-white uppercase text-sm truncate">{ad.title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">ID: {ad.id}</p>
                      </div>
                      <button 
                        onClick={() => deleteAd(ad.id)}
                        className="p-4 bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-inner"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {localConfig.ads.length === 0 && (
                    <div className="text-center py-10 text-slate-600 font-black uppercase text-xs">Hakuna matangazo yaliyowekwa</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-6">Badili Bei za Coins</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {localConfig.coinPackages.map(pkg => (
                <div key={pkg.id} className="glass p-8 rounded-[40px] border border-white/5 space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <Coins size={32} className="text-yellow-500" />
                    <div className="bg-blue-600/10 text-blue-500 px-4 py-1 rounded-full text-[10px] font-black uppercase">Package #{pkg.id}</div>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-white">{pkg.amount} <span className="text-lg text-slate-500">COINS</span></h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Bei (TZS)</label>
                    <input 
                      type="number"
                      value={pkg.price}
                      onChange={e => updatePackagePrice(pkg.id, parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-mono text-2xl outline-none focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-6">Mpangilio wa App</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Jina la App</label>
                  <input 
                    value={localConfig.appName} 
                    onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Jina la Mpokea Malipo</label>
                  <input 
                    value={localConfig.paymentName} 
                    onChange={e => setLocalConfig({...localConfig, paymentName: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Namba ya Malipo</label>
                  <input 
                    value={localConfig.paymentNumber} 
                    onChange={e => setLocalConfig({...localConfig, paymentNumber: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Namba ya WhatsApp Support</label>
                  <input 
                    value={localConfig.whatsappSupport} 
                    onChange={e => setLocalConfig({...localConfig, whatsappSupport: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 bg-blue-600/10 rounded-[32px] border border-blue-500/20 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                <Radio className="text-white" size={28} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase text-sm">Mfumo wa Kurusha Mechi</h4>
                <p className="text-xs text-slate-400 font-medium">Ukiweka Auto-Approve, maombi ya kurusha yatakubaliwa bila Admin kuingilia kati.</p>
              </div>
              <div className="ml-auto">
                <button 
                  onClick={() => setLocalConfig({...localConfig, autoApprove: !localConfig.autoApprove})}
                  className={`w-16 h-8 rounded-full transition-all relative ${localConfig.autoApprove ? 'bg-green-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localConfig.autoApprove ? 'left-9' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;