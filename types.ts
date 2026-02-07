
export type Language = 'sw' | 'en';

export interface AdItem {
  id: string;
  imageUrl: string;
  whatsappNumber: string;
  title: string;
}

export interface StreamSession {
  id: string;
  broadcasterName: string;
  gameTitle: string;
  viewerCount: number;
  thumbnailUrl: string;
  isLive: boolean;
  matchInfo?: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
  };
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface GlobalChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isAdmin?: boolean;
}

export interface CoinPackage {
  id: string;
  amount: number;
  price: number;
}

export interface AppConfig {
  appName: string;
  appTagline: string;
  ownerName: string; 
  currency: string;
  paymentNumber: string;
  paymentName: string; 
  themeColor: string;
  autoApprove: boolean;
  whatsappSupport: string;
  whatsappChannel: string;
  coinPackages: CoinPackage[];
  ads: AdItem[];
}

export interface UserAccount {
  id: string;
  username: string;
  coins: number;
  status: 'pending' | 'active' | 'blocked';
  lastTransactionId?: string;
  expiryDate: string; 
  isSubAdmin: boolean;
  isAdmin: boolean; 
}

export enum AppRoute {
  HOME = 'home',
  BROADCAST = 'broadcast',
  WATCH = 'watch',
  ADMIN = 'admin'
}
