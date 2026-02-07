
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ArrowRight, CheckCircle, Clock, ShieldCheck, Coins, Sparkles, Zap, Trophy, ShieldAlert } from 'lucide-react';
import { AppConfig, UserAccount } from '../types';

interface PaywallProps {
  config: AppConfig;
  user: UserAccount;
  onSubmitPayment: (id: string, coins: number) => void;
}

const Paywall: React.FC<PaywallProps> = ({ config, user, onSubmitPayment }) => {
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = () => {
    if (selectedPkg !== null) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId.length > 5) {
      setIsVerifying(true);
      setTimeout(() => {
        onSubmitPayment(transactionId, selectedPkg!);
        setIsVerifying(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="max-w-6xl w-full animate-in fade-in zoom-in duration-700">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20 mb-4">
            <Sparkles size={14} /> Ofa ya Adam AD: Shinda Double Michezoni
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            NUNUA <span className="text-blue-600">COINS</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Malipo yanahakikiwa automatiki na mfumo wa {config.ownerName}.
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {config.coinPackages.map((pkg, idx) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.amount)}
                  className={`relative glass p-10 rounded-[48px] border-4 cursor-pointer transition-all duration-300 group flex flex-col items-center ${
                    selectedPkg === pkg.amount 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-105' 
                    : 'border-white/5 hover:border-white/10 hover:translate-y-[-8px]'
                  }`}
                >
                  <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20" />
                    <Coins size={80} className="text-yellow-500 drop-shadow-lg" />
                  </div>

                  <div className="text-center space-y-2 mb-8">
                    <h3 className="text-5xl font-black text-white tracking-tighter">
                      {pkg.amount} <span className="text-xl text-slate-500">COINS</span>
                    </h3>
                  </div>

                  <div className="w-full bg-slate-900/50 rounded-3xl p-6 border border-white/5 text-center">
                     <div className="text-3xl font-black text-green-500 mb-1">{pkg.price.toLocaleString()}</div>
                     <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{config.currency}</div>
                  </div>

                  <div className={`mt-6 w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedPkg === pkg.amount ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-700'}`}>
                    <CheckCircle size={24} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={handleNext}
                disabled={selectedPkg === null}
                className="w-full max-w-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-6 rounded-[32px] transition-all shadow-xl hover:scale-105 text-xl flex items-center justify-center gap-4"
              >
                ENDELEA KULIPA <ArrowRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
            <div className="glass p-10 rounded-[48px] border-2 border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-6 relative">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                  <Smartphone size={40} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Peleka malipo kwa:</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{config.paymentNumber}</p>
                  <p className="text-sm font-bold text-blue-500 uppercase tracking-tighter mt-1">
                    Jina: <span className="underline decoration-blue-500/30">{config.paymentName}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-2">
                 <div className="flex justify-between text-xs font-black uppercase">
                    <span className="text-slate-500">Kifurushi</span>
                    <span className="text-white">{selectedPkg} Coins</span>
                 </div>
                 <div className="flex justify-between text-xs font-black uppercase">
                    <span className="text-slate-500">Jumla ya Bei</span>
                    <span className="text-green-500 font-black">{config.coinPackages.find(p => p.amount === selectedPkg)?.price.toLocaleString()} {config.currency}</span>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Transaction ID (Automatic Verify)</label>
                  <input 
                    type="text"
                    required
                    autoFocus
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="MFANO: RJK9382SH..."
                    className="w-full bg-slate-950 border-2 border-white/10 rounded-3xl py-6 px-8 text-white font-mono text-2xl focus:border-blue-500 outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-6 rounded-[32px] transition-all shadow-xl text-xl flex items-center justify-center gap-3"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                       <Clock className="animate-spin" /> INAHAKIKI...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={24} /> THIBITISHA MALIPO
                    </div>
                  )}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-slate-600 font-black uppercase text-[10px] tracking-widest hover:text-white">Rudi Nyuma</button>
              </form>

              <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex gap-3">
                 <ShieldAlert size={16} className="text-yellow-500 flex-shrink-0" />
                 <p className="text-[10px] text-yellow-500/70 font-bold leading-relaxed">
                   Hakikisha jina la <span className="text-yellow-500 uppercase">{config.paymentName}</span> linaonekana kabla ya kutuma hela. Malipo yote yanakaguliwa na mfumo wa Adam AD.
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Paywall;
