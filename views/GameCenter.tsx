
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Coins, Target, Zap, ArrowLeft, ShieldCheck, Sparkles, Bot, Dices, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAccount, AppConfig, Language } from '../types';
import { GoogleGenAI } from "@google/genai";
import { t } from '../translations';

interface GameCenterProps {
  user: UserAccount;
  setUser: (u: UserAccount) => void;
  config: AppConfig;
  lang: Language;
}

const GameCenter: React.FC<GameCenterProps> = ({ user, setUser, config, lang }) => {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [aiAdvice, setAiAdvice] = useState(lang === 'sw' ? "Adam AI: Karibu kwenye uwanja wa dhahabu! Chagua kiasi chako cha kubeti hapo chini." : "Adam AI: Welcome to the Golden Pitch! Choose your bet amount below.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);

  const betOptions = [1, 5, 10, 50];

  const startSpin = () => {
    if (user.coins < betAmount) {
      alert(lang === 'sw' ? "Baki yako haitoshi!" : "Insufficient balance!");
      return;
    }

    setGameState('spinning');
    setSpinDeg(prev => prev + 1800 + Math.random() * 360);
    
    const newUser = { ...user, coins: user.coins - betAmount };
    setUser(newUser);

    setTimeout(() => {
      const win = Math.random() > 0.6;
      if (win) {
        setResult('win');
        setUser({ ...newUser, coins: newUser.coins + (betAmount * 2) });
      } else {
        setResult('loss');
      }
      setGameState('result');
      getAiCommentary(win);
    }, 4000);
  };

  const getAiCommentary = async (win: boolean) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = lang === 'sw' 
        ? `Wewe ni Adam AI mchambuzi wa soka na michezo ya bahati Tanzania. Mtumiaji ametoka ${win ? 'kushinda' : 'kupoteza'} bet ya ${betAmount} Coins. Toa maoni mafupi sana kwa Kiswahili cha mitaani cha Kitanzania yanayomhamasisha kuendelea.`
        : `You are Adam AI, a football and gambling analyst in Tanzania. The user just ${win ? 'won' : 'lost'} a bet of ${betAmount} Coins. Give a very short comment in English (with a Tanzanian flavor) encouraging them to continue.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiAdvice(response.text || (win ? (lang === 'sw' ? "Dah! Umepiga kamba safi sana." : "Nice one! Great shot.") : (lang === 'sw' ? "Kipa kanyaka leo, rudi tena!" : "The keeper caught it today, try again!")));
    } catch (e) {
      setAiAdvice(win ? t(lang, 'winMessage') : t(lang, 'lossMessage'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in duration-500 pb-24">
      <div className="flex items-center justify-between">
         <button onClick={() => navigate('/')} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black uppercase text-sm">
            <ArrowLeft size={20} /> {t(lang, 'home')}
         </button>
         <div className="flex items-center gap-3 bg-yellow-500/10 px-6 py-3 rounded-2xl border-2 border-yellow-500/20 shadow-lg">
            <Coins size={22} className="text-yellow-500 animate-bounce" />
            <span className="text-white text-xl font-black">{user.coins} <span className="text-yellow-500 text-xs">{t(lang, 'coinsUpper')}</span></span>
         </div>
      </div>

      <div className="relative glass rounded-[56px] p-8 md:p-16 overflow-hidden border-4 border-yellow-500/20 text-center space-y-12 shadow-[0_0_100px_rgba(234,179,8,0.1)]">
         <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-3 bg-yellow-500/20 text-yellow-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-500/30">
               <Zap size={18} className="fill-yellow-500" /> {t(lang, 'luckGame')}
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
               ADAM <span className="text-yellow-500">BET</span>
            </h2>
            <p className="text-slate-400 font-bold text-base md:text-xl uppercase tracking-widest">{t(lang, 'penaltyGame')}</p>
         </div>

         <div className="flex flex-wrap justify-center gap-3 relative z-10">
            {betOptions.map(opt => (
               <button 
                  key={opt}
                  onClick={() => gameState === 'idle' || gameState === 'result' ? setBetAmount(opt) : null}
                  className={`px-8 py-4 rounded-2xl font-black text-lg transition-all border-2 ${betAmount === opt ? 'bg-yellow-500 text-black border-yellow-400 scale-110 shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-slate-400 border-white/10'}`}
               >
                  {opt} {t(lang, 'coinsUpper')}
               </button>
            ))}
         </div>

         <div className="relative flex flex-col items-center justify-center py-4">
            <div className="w-64 h-64 md:w-80 md:h-80 relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0, 1)" style={{ transform: `rotate(${spinDeg}deg)` }}>
               <div className="absolute inset-0 rounded-full border-[12px] border-yellow-500/30" />
               <div className="absolute inset-4 md:inset-6 bg-slate-950 rounded-full flex items-center justify-center border-4 border-white/5">
                  <Dices size={80} className="text-white/5" />
               </div>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                  <ChevronDown size={40} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,1)]" />
               </div>
            </div>
         </div>

         <div className="space-y-8 relative z-10 max-w-xl mx-auto">
            {gameState === 'idle' || gameState === 'result' ? (
               <div className="space-y-6">
                  {gameState === 'result' && (
                     <div className="animate-in zoom-in duration-300 p-8 rounded-[40px] bg-white/5 border-2 border-white/10">
                        <div className={`text-4xl md:text-7xl font-black uppercase tracking-tighter mb-2 ${result === 'win' ? 'text-green-500 shadow-green-500' : 'text-red-500'}`}>
                           {result === 'win' ? t(lang, 'winMessage') : t(lang, 'lossMessage')}
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-base">
                           {result === 'win' ? t(lang, 'winDesc', {amount: betAmount * 2}) : t(lang, 'lossDesc')}
                        </p>
                     </div>
                  )}
                  <button onClick={startSpin} className="w-full bg-yellow-500 text-black font-black py-8 rounded-[32px] text-3xl shadow-xl transition-all flex items-center justify-center gap-4">
                     {t(lang, 'startSpin')} <Zap size={32} className="fill-black" />
                  </button>
               </div>
            ) : (
               <div className="py-12 flex flex-col items-center gap-6">
                  <div className="w-24 h-24 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-2xl font-black text-yellow-500 animate-pulse uppercase tracking-widest">{t(lang, 'spinning')}</p>
               </div>
            )}
         </div>

         <div className="glass p-8 rounded-[40px] border-2 border-indigo-500/30 bg-indigo-500/5 flex items-start gap-6 text-left shadow-2xl">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0">
               <Bot size={32} className="text-white" />
            </div>
            <div className="flex-1">
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> {t(lang, 'adamAi')}
               </h4>
               <p className="text-xl text-slate-200 leading-relaxed font-bold">
                  "{isAnalyzing ? t(lang, 'waitAi') : aiAdvice}"
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GameCenter;
