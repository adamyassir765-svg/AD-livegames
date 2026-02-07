
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Clock, MessageCircleQuestion } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppConfig, UserAccount } from '../types';

interface HelpAssistantProps {
  config: AppConfig;
  user: UserAccount;
}

const HelpAssistant: React.FC<HelpAssistantProps> = ({ config, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Mambo! Mimi ni Mrisho Help AI. Una shida gani leo? Naweza kukusaidia kuhusu Coins, kurusha mechi (Streaming), au malipo.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Wewe ni Mrisho Help AI, msaidizi rasmi wa app ya GameStream AI eFootball Tanzania. 
        Mtumiaji anaitwa ${user.username}. 
        App inamilikiwa na Mrisho (Namba: ${config.paymentNumber}).
        Coins: Kifurushi cha 3 ni 2000/-, 10 ni 5000/-, 100 ni 35000/-.
        Maelekezo: Mtu akitaka kurusha mechi lazima awe na Coin 1. Anapofungua Broadcaster anachagua "Share Screen".
        Sheria: Jibu kwa Kiswahili cha kirafiki, cha mitaani cha Kitanzania lakini chenye msaada. Usijibu vitu nje ya hii app.
        
        Swali la mtumiaji: ${userMsg}`,
      });

      const aiText = response.text || "Samahani ndugu, nimepata mtikisiko kidogo. Jaribu tena!";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Mtandao unasumbua kidogo, jaribu baadae." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-8 z-[110] flex flex-col items-end">
      {isOpen && (
        <div className="glass w-[350px] h-[500px] rounded-[32px] mb-4 overflow-hidden border border-blue-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
          <div className="p-5 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                 <Bot size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase">Mrisho Help AI</h4>
                <p className="text-[10px] font-bold text-blue-100 flex items-center gap-1">
                   <Clock size={8} /> Online Sasa
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'ai' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {m.role === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'ai' ? 'bg-white/5 border border-white/5 text-slate-200' : 'bg-blue-600 text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles size={14} />
                </div>
                <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Uliza chochote hapa..."
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500 transition-all"
            />
            <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl shadow-lg active:scale-90 transition-all">
               <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" />
        {isOpen ? <X size={32} /> : <MessageCircleQuestion size={32} />}
        {!isOpen && <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full animate-ping" />}
      </button>
    </div>
  );
};

export default HelpAssistant;
