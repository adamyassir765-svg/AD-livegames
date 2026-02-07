
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { AppConfig } from '../types';

interface WhatsAppButtonProps {
  config: AppConfig;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ config }) => {
  const handleClick = () => {
    const url = `https://wa.me/${config.whatsappSupport}?text=Habari Admin Mrisho, nahitaji msaada kwenye App ya ${config.appName}`;
    window.open(url, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all hover:scale-110 active:scale-95 z-[100] group"
    >
      <MessageCircle size={32} />
      <span className="absolute right-20 bg-white text-green-600 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl border border-green-100">
        WASILIANA NA MRISHO
      </span>
    </button>
  );
};

export default WhatsAppButton;
