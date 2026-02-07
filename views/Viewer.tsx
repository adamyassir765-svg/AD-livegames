
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Trophy, PlayCircle, Share2, MessageCircle, Home, Send, Radio, Sparkles, Bot } from 'lucide-react';
import { AppConfig, UserAccount } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ViewerProps {
  config: AppConfig;
  user: UserAccount;
}

const Viewer: React.FC<ViewerProps> = ({ config, user }) => {
  const { streamId } = useParams<{ streamId: string }>();
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMode, setChatMode] = useState<'match' | 'ai'>('match');
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [aiMessages, setAiMessages] = useState<any[]>([
    { user: 'Adam AI', text: 'Mambo! Mimi ni Adam AI. Unauliza nini kuhusu mechi hii?', time: 'Sasa' }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isRestricted = !user?.isAdmin && !user?.isSubAdmin;

  useEffect(() => {
    const fetchMatchData = () => {
      if (streamId === 'admin-live-match') {
        const saved = localStorage.getItem('gs_active_match');
        if (saved) {
          const data = JSON.parse(saved);
          setMatchData(data.matchInfo);
          setIsFinished(false);
        } else if (matchData) {
          setIsFinished(true);
        }
      } else {
        setMatchData({ homeTeam: "SIMBA SC", awayTeam: "YANGA SC", homeScore: 0, awayScore: 0 });
      }
    };
    fetchMatchData();
    const interval = setInterval(fetchMatchData, 2000);
    return () => clearInterval(interval);
  }, [streamId, matchData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiMessages, showChat, chatMode]);

  const handleShare = () => {
    const link = window.location.href;
    const text = `Tazama mechi Live kupitia Adam AD Stream: ${matchData?.homeTeam} vs ${matchData?.awayTeam} ⚽🔥\nKiungo: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (chatMode === 'match') {
      setMessages(prev => [...prev, { text: chatMsg, user: user?.username || 'Shabiki', time: timeStr }]);
      setChatMsg('');
    } else {
      const userText = chatMsg;
      setAiMessages(prev => [...prev, { user: user.username, text: userText, time: timeStr }]);
      setChatMsg('');
      setIsAiTyping(true);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Wewe ni Adam AI, msaidizi wa soka kwenye app ya ${config.ownerName}. 
          Unatazama mechi ya ${matchData.homeTeam} vs ${matchData.awayTeam} (${matchData.homeScore}-${matchData.awayScore}). 
          Jibu kwa Kiswahili cha vijiweni cha soka kwa shabiki ${user.username}.
          Swali: ${userText}`,
        });
        setAiMessages(prev => [...prev, { user: 'Adam AI', text: response.text || "Nimepata hitilafu ndogo.", time: 'Sasa' }]);
      } catch (err) {
        setAiMessages(prev => [...prev, { user: 'Adam AI', text: "Mtandao unazingua ndugu, jaribu baadae.", time: 'Sasa' }]);
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  if (isFinished || !matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <div className="max-w-md w-full glass p-10 rounded-[40px] text-center space-y-8 border border-blue-500/20 shadow-2xl animate-in fade-in zoom-in duration-500">
           <Trophy size={64} className="text-yellow-500 mx-auto" />
           <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">MECHI IMEKWISHA!</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px]">Asante kwa kutazama kupitia {config.ownerName}</p>
           </div>
           <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl">RUDI NYUMBANI</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full space-y-6 ${isRestricted ? 'pt-4' : ''}`}>
      <div className="flex items-center justify-center animate-in slide-in-from-top-4 duration-500">
         <div className="bg-black/90 backdrop-blur-xl px-10 py-4 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-6">
            <div className="text-right min-w-[100px]"><p className="text-white font-black text-sm uppercase">{matchData.homeTeam}</p></div>
            <div className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-4">
               <span className="text-3xl font-black">{matchData.homeScore}</span>
               <span className="text-white/30 font-bold">-</span>
               <span className="text-3xl font-black">{matchData.awayScore}</span>
            </div>
            <div className="text-left min-w-[100px]"><p className="text-white font-black text-sm uppercase">{matchData.awayTeam}</p></div>
         </div>
      </div>

      <div className="relative flex-1 min-h-[400px] glass rounded-[40px] overflow-hidden bg-black border-2 border-white/5">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50">
           <PlayCircle size={80} className="text-white/20 animate-pulse" />
           <p className="text-white/30 font-black uppercase text-[10px] mt-4 tracking-widest">Inatambua Chanzo cha Video...</p>
        </div>
        
        {showChat && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col animate-in slide-in-from-bottom-full duration-300">
             <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex gap-2 p-1 bg-black rounded-xl">
                   <button onClick={() => setChatMode('match')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${chatMode === 'match' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Chat ya Mechi</button>
                   <button onClick={() => setChatMode('ai')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all ${chatMode === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Sparkles size={12}/> Adam AI</button>
                </div>
                <button onClick={() => setShowChat(false)} className="bg-white/5 p-2 rounded-full text-slate-400">Funga</button>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {(chatMode === 'match' ? messages : aiMessages).map((m, i) => (
                   <div key={i} className={`p-4 rounded-2xl border border-white/5 ${m.user === 'Adam AI' ? 'bg-indigo-900/20' : 'bg-white/5'}`}>
                      <div className="flex justify-between mb-1">
                         <span className={`text-[10px] font-black uppercase ${m.user === 'Adam AI' ? 'text-indigo-400' : 'text-blue-400'}`}>{m.user}</span>
                         <span className="text-[10px] text-slate-600">{m.time}</span>
                      </div>
                      <p className="text-sm text-slate-200">{m.text}</p>
                   </div>
                ))}
                {isAiTyping && chatMode === 'ai' && (
                  <div className="flex gap-2 items-center text-indigo-500 font-bold text-xs"><Bot size={14} className="animate-spin"/> Adam AI anaandika...</div>
                )}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={sendMsg} className="p-4 bg-slate-900 border-t border-white/10 flex gap-2">
                <input 
                  value={chatMsg} 
                  onChange={e => setChatMsg(e.target.value)} 
                  placeholder={chatMode === 'ai' ? "Uliza Adam AI..." : "Andika hapa shabiki..."} 
                  className="flex-1 bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500"
                />
                <button type="submit" className={`p-4 rounded-xl text-white transition-all shadow-lg ${chatMode === 'ai' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                  <Send size={20} />
                </button>
             </form>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full max-w-4xl mx-auto pb-4 px-4">
          <button onClick={handleShare} className="flex-1 bg-green-600 p-4 rounded-2xl text-white font-black flex items-center justify-center gap-3"><Share2 size={20} /> SHARE MECHI</button>
          <button onClick={() => setShowChat(true)} className="flex-1 bg-blue-600 p-4 rounded-2xl text-white font-black flex items-center justify-center gap-3"><MessageCircle size={20} /> CHAT NA WADAU / AI</button>
          <button onClick={() => navigate('/')} className="flex-1 bg-slate-800 p-4 rounded-2xl text-white font-black flex items-center justify-center gap-3"><Home size={20} /> NYUMBANI</button>
      </div>
    </div>
  );
};

export default Viewer;
