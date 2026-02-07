
import React, { useState, useRef, useEffect } from 'react';
import { Radio, Sparkles, MonitorPlay, Minus, Plus, Layout } from 'lucide-react';
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
    try {
      const mediaDevices = navigator.mediaDevices as any;
      const screenStream = await mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true
      });
      screenStream.getVideoTracks()[0].onended = () => resetPreparation();
      setStream(screenStream);
      setIsPreparing(true);
    } catch (err: any) {
      setError("Tafadhali chagua Screen au Tab ya Game yako.");
    }
  };

  const resetPreparation = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsPreparing(false);
    setIsLive(false);
    localStorage.removeItem('gs_active_match');
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
  };

  const confirmBroadcast = () => {
    if (!user.isAdmin && !onDeductCoin()) {
      setError("Huna Coin ya kutosha!");
      return;
    }
    setIsPreparing(false);
    setIsLive(true);
    startAiCommentary();
  };

  const startAiCommentary = () => {
    analysisIntervalRef.current = window.setInterval(async () => {
        if (!canvasRef.current || !videoRef.current || !isLive) return;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            canvasRef.current.width = 640; 
            canvasRef.current.height = 360;
            ctx.drawImage(videoRef.current, 0, 0, 640, 360);
            const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
            
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = lang === 'sw' 
                    ? `Wewe ni Adam AI, mtangazaji mahiri wa eFootball Tanzania. Hali ya mechi: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}. Chambua picha hii kwa Kiswahili cha mitaani cha soka. Toa sentensi 2 tu fupi na za kishabiki.`
                    : `You are Adam AI, a professional eFootball commentator in Tanzania. Match status: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}. Analyze this image in Tanzanian football slang. Give only 2 short and exciting sentences.`;
                
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
                if (text) setAiComments(prev => [text, ...prev.slice(0, 10)]);
            } catch (error) {
                console.error("AI Error:", error);
            }
        }
    }, 15000);
  };

  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
    return () => {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    };
  }, [stream]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {error && <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl text-red-400 font-bold">{error}</div>}
        <div className="relative aspect-video glass rounded-[32px] overflow-hidden bg-black flex items-center justify-center shadow-2xl border-2 border-white/5">
          {!isPreparing && !isLive ? (
            <div className="text-center p-8 space-y-8">
              <MonitorPlay size={64} className="text-blue-500 mx-auto" />
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Rusha Mechi</h3>
                <div className="flex gap-4 max-w-sm mx-auto">
                  <input value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-bold flex-1 outline-none focus:border-blue-500" placeholder="HOME" />
                  <input value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white text-center font-bold flex-1 outline-none focus:border-blue-500" placeholder="AWAY" />
                </div>
              </div>
              <button onClick={handlePrepare} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-12 rounded-2xl flex items-center gap-3 mx-auto transition-transform active:scale-95 shadow-xl">
                <Radio size={24} /> CHAGUA KIOO CHA GAME
              </button>
            </div>
          ) : (
            <div className="absolute inset-0">
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
               <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 z-10">
                  <span className="text-white font-black text-sm uppercase">{homeTeam}</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black">{homeScore} - {awayScore}</span>
                  <span className="text-white font-black text-sm uppercase">{awayTeam}</span>
               </div>
            </div>
          )}
        </div>

        {(isLive || isPreparing) && (
          <div className="glass p-8 rounded-[32px] space-y-6">
             <div className="flex gap-4">
                {isPreparing && <button onClick={confirmBroadcast} className="flex-1 bg-green-600 text-white font-black py-4 rounded-xl shadow-lg">THIBITISHA KUANZA LIVE</button>}
                <button onClick={resetPreparation} className="flex-1 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-4 rounded-xl font-black transition-all">ZIMA MECHI</button>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 grid grid-cols-2 gap-8 text-center">
                <div>
                   <p className="text-[10px] text-slate-500 font-black uppercase mb-2">{homeTeam}</p>
                   <div className="flex items-center justify-center gap-4">
                      <button onClick={() => setHomeScore(s => Math.max(0, s-1))} className="p-2 bg-white/5 rounded-lg">-</button>
                      <span className="text-4xl font-black">{homeScore}</span>
                      <button onClick={() => setHomeScore(s => s+1)} className="p-2 bg-white/5 rounded-lg">+</button>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-black uppercase mb-2">{awayTeam}</p>
                   <div className="flex items-center justify-center gap-4">
                      <button onClick={() => setAwayScore(s => Math.max(0, s-1))} className="p-2 bg-white/5 rounded-lg">-</button>
                      <span className="text-4xl font-black">{awayScore}</span>
                      <button onClick={() => setAwayScore(s => s+1)} className="p-2 bg-white/5 rounded-lg">+</button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="glass rounded-[32px] flex flex-col h-[600px] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-2">
          <Sparkles className="text-blue-400" size={20} />
          <h4 className="font-black text-white uppercase text-sm">Adam AI Analysis</h4>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/30">
           {aiComments.map((comment, i) => (
              <div key={i} className={`p-4 rounded-2xl text-xs leading-relaxed ${i === 0 ? 'bg-blue-600/10 text-white border border-blue-500/30' : 'bg-white/5 text-slate-400'}`}>
                 {comment}
              </div>
           ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Broadcaster;
