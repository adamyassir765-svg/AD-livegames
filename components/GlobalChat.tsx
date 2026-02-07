
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Users, ShieldCheck, Sparkles, Bot, Clock, User } from 'lucide-react';
import { GlobalChatMessage, UserAccount, AppConfig, Language } from '../types';
import { GoogleGenAI } from "@google/genai";
import { t } from '../translations';

interface GlobalChatProps {
  user: UserAccount;
  config: AppConfig;
  lang: Language;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ user, config, lang }) => {
  const [activeTab, setActiveTab] = useState<'community' | 'ai'>('community');
  const [messages, setMessages] = useState<GlobalChatMessage[]>([]);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', text: string, time: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAiMessages([{ 
      role: 'ai', 
      text: lang === 'sw' 
        ? `Mambo! Mimi ni Adam Help AI. Una shida gani leo? Naweza kukusaidia kuhusu Coins, kurusha mechi, au malipo ya ${config.paymentName}.` 
        : `Hello! I am Adam Help AI. How can I help you today? I can assist with Coins, streaming matches, or payments for ${config.paymentName}.`, 
      time: 'Now' 
    }]);
  }, [lang, config.paymentName]);

  useEffect(() => {
    const saved = localStorage.getItem('gs_global_chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { id: '1', user: `Admin ${config.ownerName.split(' ')[0]}`, text: lang === 'sw' ? 'Karibuni sana wadau!' : 'Welcome everyone!', time: '10:00 AM', isAdmin: true }
      ]);
    }
  }, [lang, config.ownerName]);

  useEffect(() => {
    localStorage.setItem('gs_global_chat', JSON.stringify(messages));
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, aiMessages, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (activeTab === 'community') {
      const newMessage: GlobalChatMessage = {
        id: Date.now().toString(),
        user: user.username,
        text: inputText,
        time: timeStr,
        isAdmin: user.isAdmin
      };
      setMessages(prev => [...prev.slice(-49), newMessage]);
      setInputText('');
    } else {
      const userText = inputText;
      setAiMessages(prev => [...prev, { role: 'user', text: userText, time: timeStr }]);
      setInputText('');
      setIsAiTyping(true);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Wewe ni Adam Help AI, msaidizi rasmi wa app ya ${config.appName} Tanzania inayomilikiwa na ${config.ownerName}. 
          Lugha ya mazungumzo sasa ni ${lang === 'sw' ? 'Kiswahili' : 'English'}.
          Swali la mtumiaji ${user.username}: ${userText}`,
        });
        setAiMessages(prev => [...prev, { role: 'ai', text: response.text || "...", time: 'Now' }]);
      } catch (err) {
        setAiMessages(prev => [...prev, { role: 'ai', text: "Error. Contact WhatsApp.", time: 'Now' }]);
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  return (
    <div className="glass rounded-[40px] border border-white/5 flex flex-col h-[600px] overflow-hidden shadow-2xl">
      <div className="bg-white/5 p-2 flex gap-1">
        <button onClick={() => setActiveTab('community')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'community' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
          {t(lang, 'kijiwe')}
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
          {t(lang, 'adamAi')}
        </button>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/40">
        {(activeTab === 'community' ? messages : aiMessages).map((msg, i) => (
          <div key={i} className={`flex gap-3 items-start ${msg.user === user.username || (msg as any).role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`p-4 rounded-3xl text-sm ${msg.isAdmin || (msg as any).role === 'ai' ? 'bg-blue-600/20' : 'bg-slate-800'}`}>
                <p>{msg.text}</p>
             </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
        <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="..." className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none" />
        <button type="submit" className="p-4 bg-blue-600 rounded-2xl text-white">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default GlobalChat;
