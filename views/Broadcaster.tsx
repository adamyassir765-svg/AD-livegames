import React, { useState, useRef, useEffect } from 'react';
import { Radio, Sparkles, MonitorPlay, Minus, Plus, Layout, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserAccount, Language } from '../types';

interface BroadcasterProps {
  user: UserAccount;
  onDeductCoin: () => boolean;
  lang: Language;
}

const Broadcaster: React.FC<BroadcasterProps> = ({ user, onDeductCoin, lang }) => {
  const [isLive, setIsLive] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [aiComments, setAiComments] = useState<string[]>(["ADAM AI: Tayari kutoa uchambuzi wa pira limepamba moto!"]);
  const [error, setError] = useState<string | null>(null);
  
  const [homeTeam, setHomeTeam] = useState("SIMBA");
  const [awayTeam, setAwayTeam] = useState("YANGA");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLive) {
      const matchData = {
        id: 'admin-live-match',
        broadcasterName: user.username,
        gameTitle: `${homeTeam} vs ${awayTeam}`,
        viewerCount: Math.floor(Math.random() * 500) + 1500,
        isLive: true,
        matchInfo: { homeTeam, awayTeam, homeScore, awayScore }
      };
      localStorage.setItem('gs_active_match', JSON.stringify(matchData));
    } else {
      localStorage.removeItem('gs_active_match');
    }
  }, [homeTeam, awayTeam, homeScore, awayScore, isLive, user.username]);

  const handlePrepare = async () => {
    setError(null);
    
    if (!navigator.mediaDevices || !('getDisplayMedia' in navigator.mediaDevices)) {
      setError("Kivinjari chako hakiruhusu 'Screen Sharing'. Tafadhali tumia Chrome kwenye PC au simu ya Android ya kisasa.");
      return;
    }

    try {
      // Tunajaribu kuomba kioo kwanza. Audio tunaifanya kuwa optional ili isikwamishe mchakato.
      // Use 'as any' to avoid TypeScript errors with non-standard 'cursor' or 'displaySurface' properties in MediaTrackConstraints
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          displaySurface: "browser", // Inasaidia zaidi kwenye mobile kuchagua tab
          cursor: "always" 
        } as any,
        audio: false // Tumezima audio kwa muda ili kupunguza makosa ya ruhusa (permissions)
      });

      screenStream.getVideoTracks()[0].onended = () => {
        resetPreparation();
      };

      setStream(screenStream);
      setIsPreparing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
    } catch (err: any) {
      console.error("Screen Share Error:", err);
      if (err.name === 'NotAllowedError') {
        setError("Umekataa kutoa ruhusa ya kuona kioo chako. Tafadhali jaribu tena na ukubali (Allow).");
      } else {
        setError("Imeshindikana kufungua kioo. Hakikisha hujafungua app nyingine inayotumia kioo au jaribu ku-refresh ukurasa.");
      }
    }
  };

  const resetPreparation = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsPreparing(false);
    setIsLive(false);
    localStorage.removeItem('gs_active_match');
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  const confirmBroadcast = () => {
    if (!user.isAdmin && !user.isSubAdmin && !onDeductCoin()) {
      setError("Huna Coin ya kutosha kuanza mechi!");
      return;
    }
    setIsPreparing(false);
    setIsLive(true);
    startAiCommentary();
  };

  const startAiCommentary = () => {
    // Futa interval ya zamani kama ipo
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);

    analysisIntervalRef.current = window.setInterval(async () => {
        if (!canvasRef.current || !videoRef.current || !isLive) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && videoRef.current.readyState >= 2) {
            canvasRef.current.width = 640; 
            canvasRef.current.height = 360;
            ctx.drawImage(videoRef.current, 0, 0, 640, 360);
            
            try {
                const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const prompt = lang === 'sw' 
                    ? `Wewe ni Adam AI, mtangazaji mahiri wa eFootball Tanzania. Hali ya mechi: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}. Chambua picha hii fupi fupi kwa Kiswahili cha mitaani cha soka cha bongo. Toa sentensi 2 tu fupi na kali.`
                    : `You are Adam AI, a professional eFootball commentator in Tanzania. Match status: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}. Analyze this match frame in Tanzanian football slang. Max 2 short sentences.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: {
                        parts: [
                            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                            { text: prompt }
                        ]
                    }
                });
                
                const text = response.text;
                if (text) {
                  setAiComments(prev => [text, ...prev.slice(0, 15)]);
                }
            } catch (error) {
                console.error("AI Analysis Error:", error);
            }
        }
    }, 12000); // Kila baada ya sekunde 12
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    };
  }, [stream]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/30 p-5 rounded-3xl text-red-400 font-bold flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="relative aspect-video glass rounded-[32px] overflow-hidden bg-black flex items-center justify-center shadow-2xl border-2 border-white/5">
          {!isPreparing && !isLive ? (
            <div className="text-center p-8 space-y-8 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border-2 border-blue-600/20">
                <MonitorPlay size={48} className="text-blue-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Maandalizi ya Stream</h3>
                <div className="flex gap-4 max-w-sm mx-auto">
                  <input value={homeTeam} onChange={e => setHomeTeam(e.target.value.toUpperCase())} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-black flex-1 outline-none focus:border-blue-500 transition-all" placeholder="NYUMBANI" />
                  <div className="flex items-center text-slate-600 font-black">VS</div>
                  <input value={awayTeam} onChange={e => setAwayTeam(e.target.value.toUpperCase())} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-black flex-1 outline-none focus:border-blue-500 transition-all" placeholder="UGENINI" />
                </div>
              </div>
              <button 
                onClick={handlePrepare} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-12 rounded-2xl flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                <Radio size={24} /> CHAGUA KIOO CHA GAME
              </button>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hakikisha eFootball imefunguliwa kwenye Tab au Window nyingine</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-900">
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
               <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 z-10 shadow-2xl">
                  <span className="text-white font-black text-sm uppercase tracking-tighter">{homeTeam}</span>
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-xl font-black text-xl flex items-center gap-3">
                    <span>{homeScore}</span>
                    <span className="text-blue-400">-</span>
                    <span>{awayScore}</span>
                  </div>
                  <span className="text-white font-black text-sm uppercase tracking-tighter">{awayTeam}</span>
               </div>
               {!isLive && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <p className="text-white font-black text-xl">Kioo kimeunganishwa! ✅</p>
                      <p className="text-slate-300 text-sm">Bonyeza 'THIBITISHA' kuanza kurusha kwa watazamaji.</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>

        {(isLive || isPreparing) && (
          <div className="glass p-8 rounded-[32px] space-y-6 animate-in slide-in-from-bottom-4">
             <div className="flex gap-4">
                {isPreparing && (
                  <button 
                    onClick={confirmBroadcast} 
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    THIBITISHA KUANZA LIVE
                  </button>
                )}
                <button 
                  onClick={resetPreparation} 
                  className="flex-1 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-5 rounded-2xl font-black transition-all border border-red-500/20"
                >
                  {isLive ? 'ZIMA MECHI' : 'BATILISHA'}
                </button>
             </div>
             
             {isLive && (
               <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 grid grid-cols-2 gap-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">{homeTeam}</p>
                    <div className="flex items-center justify-center gap-6">
                        <button onClick={() => setHomeScore(s => Math.max(0, s-1))} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">-</button>
                        <span className="text-5xl font-black text-white">{homeScore}</span>
                        <button onClick={() => setHomeScore(s => s+1)} className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">+</button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">{awayTeam}</p>
                    <div className="flex items-center justify-center gap-6">
                        <button onClick={() => setAwayScore(s => Math.max(0, s-1))} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">-</button>
                        <span className="text-5xl font-black text-white">{awayScore}</span>
                        <button onClick={() => setAwayScore(s => s+1)} className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">+</button>
                    </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      <div className="glass rounded-[32px] flex flex-col h-[650px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-400" size={20} />
            <h4 className="font-black text-white uppercase text-xs tracking-widest">Adam AI Commentary</h4>
          </div>
          {isLive && <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping"/><span className="text-[10px] font-black text-green-500">ACTIVE</span></div>}
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/30 scrollbar-hide">
           {aiComments.map((comment, i) => (
              <div key={i} className={`p-5 rounded-3xl text-xs leading-relaxed transition-all animate-in slide-in-from-left-2 ${i === 0 && isLive ? 'bg-blue-600/20 text-white border-2 border-blue-500/30 shadow-lg scale-105' : 'bg-white/5 text-slate-400 border border-white/5'}`}>
                 <p className="font-bold">{comment}</p>
                 <span className="text-[8px] text-slate-600 mt-2 block uppercase font-black tracking-widest">Analysis #{aiComments.length - i}</span>
              </div>
           ))}
           {aiComments.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
                <Sparkles size={48} />
                <p className="text-xs font-black uppercase">Anza Mechi ili Adam AI aanze kuchambua kioo chako.</p>
             </div>
           )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Broadcaster;