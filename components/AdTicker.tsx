
import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { AdItem } from '../types';

interface AdTickerProps {
  ads: AdItem[];
}

const AdTicker: React.FC<AdTickerProps> = ({ ads }) => {
  if (!ads || ads.length === 0) return null;

  const handleAdClick = (whatsappNumber: string, title: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=Habari, nimeona tangazo lako la "${title}" kwenye Adam AD Stream. Nahitaji maelezo zaidi.`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-slate-900/30 border-b border-white/5 overflow-hidden py-4 md:py-6">
      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="flex gap-6 animate-marquee min-w-full px-4">
          {[...ads, ...ads].map((ad, index) => (
            <div 
              key={`${ad.id}-${index}`} 
              className="inline-flex flex-col bg-white/5 rounded-[32px] border border-white/10 min-w-[300px] md:min-w-[450px] overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl"
            >
              <div className="h-40 md:h-56 w-full relative overflow-hidden">
                <img 
                  src={ad.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'} 
                  alt={ad.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                   <span className="text-white font-black text-xs md:text-sm uppercase truncate drop-shadow-lg">{ad.title}</span>
                   <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
                      <ExternalLink size={14} className="text-white" />
                   </div>
                </div>
              </div>
              <div className="p-4 flex gap-3">
                <button 
                  onClick={() => handleAdClick(ad.whatsappNumber, ad.title)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  <MessageCircle size={14} /> AGIZA / ULIZIA SASA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AdTicker;
