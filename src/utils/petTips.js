export const petTips = {
  // When user makes money
  profit: [
    "Nice trade! 📈 You're learning fast!",
    "Smart move! Keep watching those trends!",
    "Cha-ching! 💰 You're getting good at this!",
    "Profit! That's what I call smart investing!",
    "You're on fire! 🔥 Keep it up!",
  ],
  
  // When user loses money
  loss: [
    "Don't worry! Even pros lose sometimes. Learn from it! 📚",
    "Oops! Remember: buy low, sell high! 💡",
    "That's okay! Every investor has bad days.",
    "Learning moment! Think about timing your trades better.",
    "Shake it off! You'll get the next one! 💪",
  ],
  
  // Stock price drops
  priceDrop: [
    "Psst! 👀 Stock prices just dropped - might be a buying opportunity!",
    "Flash sale on stocks! Buy low, sell high! 🎯",
    "Market dip! Smart investors look for bargains.",
    "Prices are down! Could be your chance to buy cheap!",
  ],
  
  // Stock price rises
  priceRise: [
    "Stocks are climbing! 🚀 Got any to sell for profit?",
    "Market's hot! Consider taking some profits!",
    "Prices are up! Time to cash in? 💵",
    "Boom! 📊 Those stocks are gaining value!",
  ],
  
  // Near goal
  nearGoal: [
    "You're SO close to $200! Just $X more! 🎯",
    "Almost there! $X away from your goal! Keep going! 💪",
    "Can you smell success? Only $X to go! 🏆",
  ],
  
  // Achieved goal
  goalAchieved: [
    "🎉 YOU DID IT! $200 achieved! You're a financial genius!",
    "🏆 GOAL REACHED! That's some serious trading skills!",
    "💎 LEGENDARY! You turned $100 into $200! Amazing!",
    "🚀 TO THE MOON! Goal completed! You're unstoppable!",
  ],
  
  // Low balance warning
  lowBalance: [
    "⚠️ Balance getting low! Be careful with your trades!",
    "Watch out! You're running low on cash. Trade wisely!",
    "💡 Low funds alert! Time to sell some winners?",
  ],
  
  // Starting tips
  welcome: [
    "Hey there! 👋 I'm your trading buddy! Buy low, sell high!",
    "Welcome to the Mini Market! Let's make some money! 💰",
    "Ready to learn investing? I'll help you every step! 🎓",
  ]
};

export function getRandomTip(category) {
  const tips = petTips[category] || petTips.welcome;
  return tips[Math.floor(Math.random() * tips.length)];
}

export function getTipWithAmount(category, amount) {
  const tips = petTips[category];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return tip.replace('$X', `$${Math.abs(amount).toFixed(2)}`);
}