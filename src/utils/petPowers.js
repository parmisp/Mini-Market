// Pet Powers System - Easter Eggs!
// Each special name unlocks unique abilities

const PET_POWERS = {
  // Finance Legends
  'warren': {
    name: '💰 Buffett\'s Wisdom',
    description: 'See which stocks are undervalued!',
    color: '#10b981',
    emoji: '💎',
    effect: 'Shows hidden "VALUE!" badge on cheap stocks',
    ability: (stock) => stock.price < 10 ? 'undervalued' : null
  },
  
  'buffett': {
    name: '📈 Oracle Vision',
    description: 'Predict next price movement!',
    color: '#3b82f6',
    emoji: '🔮',
    effect: 'Shows arrow preview of next price change',
    ability: () => Math.random() > 0.5 ? 'will-rise' : 'will-fall'
  },
  
  'elon': {
    name: '🚀 Rocket Boost',
    description: 'Double rewards on sales!',
    color: '#ec4899',
    emoji: '🚀',
    effect: 'Earn 2x profit when selling stocks',
    ability: (profit) => profit * 2
  },
  
  'musk': {
    name: '⚡ Tesla Charge',
    description: 'Faster market updates!',
    color: '#f59e0b',
    emoji: '⚡',
    effect: 'Stocks update every 60 seconds',
    ability: 'speed-boost'
  },
  
  // Kid-Friendly Names
  'lucky': {
    name: '🍀 Lucky Charm',
    description: 'Random bonus money!',
    color: '#22c55e',
    emoji: '🍀',
    effect: 'Get $5 bonus randomly',
    ability: 'random-bonus'
  },
  
  'penny': {
    name: '💰 Penny Saver',
    description: 'Stocks cost 50% less!',
    color: '#f97316',
    emoji: '🪙',
    effect: 'All buys are half price',
    ability: (price) => price * 0.5
  },
  
  'diamond': {
    name: '💎 Diamond Hands',
    description: 'Stocks you hold gain value!',
    color: '#06b6d4',
    emoji: '💎',
    effect: '+$1 per stock owned every update',
    ability: 'hold-bonus'
  },
  
  'rocket': {
    name: '🚀 Moon Shot',
    description: 'See secret "MOON" stocks!',
    color: '#8b5cf6',
    emoji: '🌙',
    effect: 'Reveals hidden high-growth stocks',
    ability: 'reveal-moonshot'
  },
  
  'ninja': {
    name: '🥷 Stealth Trader',
    description: 'Buy without price going up!',
    color: '#6366f1',
    emoji: '🥷',
    effect: 'Your trades don\'t affect prices',
    ability: 'stealth-mode'
  },
  
  'wizard': {
    name: '🧙 Market Wizard',
    description: 'Undo last bad trade!',
    color: '#a855f7',
    emoji: '🪄',
    effect: 'One-time undo button appears',
    ability: 'time-reverse'
  },
  
  'phoenix': {
    name: '🔥 Phoenix Revival',
    description: 'Can\'t go below $50!',
    color: '#ef4444',
    emoji: '🔥',
    effect: 'Auto-bailout if balance drops too low',
    ability: 'safety-net'
  },
  
  'dragon': {
    name: '🐉 Dragon Hoard',
    description: 'Earn interest on cash!',
    color: '#dc2626',
    emoji: '🐉',
    effect: '+1% cash every 30 seconds',
    ability: 'interest-gain'
  },
  
  // Meme/Fun Names
  'doge': {
    name: '🐕 Much Wow',
    description: 'Random meme events!',
    color: '#facc15',
    emoji: '🐕',
    effect: 'Surprise bonuses and effects',
    ability: 'meme-magic'
  },
  
  'yolo': {
    name: '🎲 All-In Energy',
    description: 'Higher risk, higher reward!',
    color: '#f43f5e',
    emoji: '🎲',
    effect: 'Stocks swing +/- 50% more',
    ability: 'volatility-boost'
  },
  
  'chad': {
    name: '💪 Big Brain',
    description: 'See everyone\'s favorite stock!',
    color: '#14b8a6',
    emoji: '💪',
    effect: 'Shows trending stock badge',
    ability: 'social-signal'
  },
  
  'stonks': {
    name: '📈 Only Up',
    description: 'Your stocks never go down!',
    color: '#10b981',
    emoji: '📈',
    effect: 'Personal stocks only rise',
    ability: 'always-up'
  },

  // Secret Easter Egg
  'stocky': {
    name: '🦉 Secret Hoot Mode',
    description: 'Unlocks Stocky’s hidden glow!',
    color: '#38bdf8',
    emoji: '🌟',
    effect: 'Pet glows and gives tiny bonus on high-fives',
    ability: 'secret-hoot'
  }
};

export function getPetPower(petName) {
  if (!petName) return null;
  
  const name = petName.toLowerCase().trim();
  const power = PET_POWERS[name];
  
  if (power) {
    return {
      key: name,
      ...power,
      isActive: true,
      petName: petName
    };
  }
  
  return null;
}

export function applyPetPower(powerName, value, context) {
  const power = Object.values(PET_POWERS).find(p => p.name === powerName);
  if (!power || !power.ability) return value;
  
  if (typeof power.ability === 'function') {
    return power.ability(value, context);
  }
  
  return value;
}

export function getAllPowerNames() {
  return Object.keys(PET_POWERS);
}

export function getPetPowerList() {
  return Object.entries(PET_POWERS).map(([key, value]) => ({
    key,
    ...value
  }));
}

export function getPowerHint() {
  const hints = [
    "Try naming your pet after a famous investor! 💰",
    "Certain magical names unlock special abilities! 🧙",
    "Internet meme names have surprise powers! 🐕",
    "Try lucky, diamond, or rocket! 🚀",
    "Phoenix gives you a safety net! 🔥"
  ];
  return hints[Math.floor(Math.random() * hints.length)];
}
