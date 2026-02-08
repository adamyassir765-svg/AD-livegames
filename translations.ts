
import { Language } from './types';

export const translations = {
  sw: {
    discover: 'Gundua',
    broadcast: 'Rusha Live',
    games: 'Michezo',
    home: 'Nyumbani',
    coins: 'Coins',
    coinsUpper: 'COINS',
    officialStream: 'Stream Rasmi ya AD Stream',
    heroTitle1: 'PIRA',
    heroTitle2: 'LIVE',
    heroDesc: 'Ungana na wadau wa soka Tanzania kupitia AD Stream. Tazama mechi, cheza michezo ya ushindi na uchambuzi wa AI.',
    rushaMechi: 'Rusha Mechi',
    joinChannel: 'Jiunge na Channel',
    luckGame: 'MCHEZO WA BAHATI',
    penaltyGame: 'Piga Penalty • Shinda Coins x2 Papo Hapo!',
    playNow: 'CHEZA SASA',
    liveMatches: 'Mechi Live',
    kijiwe: 'Kijiwe',
    adamAi: 'Adam AI',
    requiredCoins: 'Inahitaji Coin',
    betAmount: 'Kiasi cha Bet',
    startSpin: 'ANZA MCHEZO',
    spinning: 'Inazunguka...',
    winMessage: 'GOOOLIII! 🔥',
    lossMessage: 'UMEKOSA! ❌',
    winDesc: 'Umeshinda {amount} Coins!',
    lossDesc: 'Kipa kaokoa, jaribu tena kumpiga chenga.',
    buyCoins: 'NUNUA COINS',
    payTo: 'Peleka malipo kwa:',
    confirmPayment: 'THIBITISHA MALIPO',
    verifying: 'INAHAKIKI...',
    adminPanel: 'Admin Mkuu',
    subAdminPanel: 'Panel ya Sub-Admin',
    logout: 'Ondoka',
    back: 'Rudi',
    waitAi: 'Adam AI anaangalia uwezo wa kipa...',
    liveNow: 'LIVE SASA',
    clickToWatch: 'Bonyeza Kutazama',
    installApp: 'Download AD Stream App',
    installDesc: 'Sakinisha kwenye simu yako kwa uzoefu bora zaidi wa kurusha mechi.',
    installButton: 'DOWNLOAD SASA',
    iphoneTip: "Bonyeza 'Share' kisha 'Add to Home Screen' kusakinisha AD Stream.",
  },
  en: {
    discover: 'Discover',
    broadcast: 'Go Live',
    games: 'Games',
    home: 'Home',
    coins: 'Coins',
    coinsUpper: 'COINS',
    officialStream: 'Official AD Stream',
    heroTitle1: 'MATCH',
    heroTitle2: 'LIVE',
    heroDesc: 'Connect with football fans in Tanzania via AD Stream. Watch matches, play winning games, and get AI support.',
    rushaMechi: 'Start Stream',
    joinChannel: 'Join Channel',
    luckGame: 'GAME of CHANCE',
    penaltyGame: 'Take a Penalty • Win x2 Coins Instantly!',
    playNow: 'PLAY NOW',
    liveMatches: 'Live Matches',
    kijiwe: 'Community',
    adamAi: 'Adam AI',
    requiredCoins: 'Coins Required',
    betAmount: 'Bet Amount',
    startSpin: 'START GAME',
    spinning: 'Spinning...',
    winMessage: 'GOAAAL! 🔥',
    lossMessage: 'MISSED! ❌',
    winDesc: 'You won {amount} Coins!',
    lossDesc: 'The keeper saved it, try to dribble past him again.',
    buyCoins: 'BUY COINS',
    payTo: 'Send payment to:',
    confirmPayment: 'CONFIRM PAYMENT',
    verifying: 'VERIFYING...',
    adminPanel: 'Main Admin',
    subAdminPanel: 'Sub-Admin Panel',
    logout: 'Logout',
    back: 'Back',
    waitAi: 'Adam AI is checking the keeper...',
    liveNow: 'LIVE NOW',
    clickToWatch: 'Click to Watch',
    installApp: 'Download AD Stream App',
    installDesc: 'Install on your device for the best streaming experience.',
    installButton: 'DOWNLOAD NOW',
    iphoneTip: "Tap 'Share' then 'Add to Home Screen' to install AD Stream.",
  }
};

export type TranslationKeys = keyof typeof translations.sw;

export const t = (lang: Language, key: TranslationKeys, replacements?: Record<string, any>) => {
  let text = translations[lang][key] || key;
  if (replacements) {
    Object.keys(replacements).forEach(k => {
      text = text.replace(`{${k}}`, replacements[k]);
    });
  }
  return text;
};
