
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ChevronRight, Activity } from 'lucide-react';
import { StreamSession, Language } from '../types';
import { t } from '../translations';

interface MatchTickerProps {
  streams: StreamSession[];
  lang: Language;
}

const MatchTicker: React.FC<MatchTickerProps> = ({ streams, lang }) => {
  const navigate = useNavigate();

  if (streams.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] bg-black/95 backdrop-blur-2xl border-t border-white/10 h-14 md:h-16 flex items-center overflow-hidden">
      <div className="flex-shrink-0 bg-red-600 px-4 h-full flex items-center gap-2 z-20 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
        <Activity size={16} className="text-white animate-pulse" />
        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">{t(lang, 'liveNow')}</span>
      </div>

      <div className="flex-1 relative overflow-hidden h-full flex items-center">
        <div className="flex gap-12 animate-marquee-slow whitespace-nowrap px-8">
          {[...streams, ...streams].map((stream, idx) => (
            <button
              key={`${stream.id}-${idx}`}
              onClick={() => navigate(`/watch/${stream.id}`)}
              className="flex items-center gap-4 group hover:bg-white/5 px-4 py-2 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-black text-white uppercase tracking-tighter">
                  {stream.matchInfo?.homeTeam}
                </span>
                <div className="bg-blue-600 px-2 py-0.5 rounded-md text-[10px] md:text-xs font-black text-white">
                  {stream.matchInfo?.homeScore} - {stream.matchInfo?.awayScore}
                </div>
                <span className="text-sm md:text-base font-black text-white uppercase tracking-tighter">
                  {stream.matchInfo?.awayTeam}
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t(lang, 'clickToWatch')}</span>
                <ChevronRight size={14} className="text-blue-500" />
              </div>
              <div className="w-[1px] h-4 bg-white/10 ml-4" />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 25s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MatchTicker;
