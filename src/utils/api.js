// API utility functions for stock trading
// Currently using hardcoded data for testing - backend will be connected later

// Hardcoded stock data for testing (no backend needed)
const MOCK_STOCKS = [
  { id: 1, name: 'TechCoin', emoji: '💻', price: 15.50, trend: 'up', history: [] },
  { id: 2, name: 'FoodStock', emoji: '🍕', price: 8.25, trend: 'down', history: [] },
  { id: 3, name: 'GameShare', emoji: '🎮', price: 12.00, trend: 'up', history: [] },
];

// Initialize history with starting prices
MOCK_STOCKS.forEach(stock => {
  for (let i = 0; i < 20; i++) {
    stock.history.push(stock.price + (Math.random() - 0.5) * 3);
  }
});

// Volatility multipliers based on difficulty
const VOLATILITY = {
  easy: 1,    // Small price swings: ±$0.50
  medium: 2,  // Normal volatility: ±$1.00
  hard: 4     // Big swings: ±$2.00
};

// Simulate price fluctuations
const fluctuatePrices = (stocks, difficulty = 'medium') => {
  const volatility = VOLATILITY[difficulty] || VOLATILITY.medium;

  return stocks.map(stock => {
    const change = (Math.random() - 0.5) * volatility; // Varies by difficulty
    const newPrice = Math.max(5, stock.price + change); // Keep price above $5
    const trend = newPrice > stock.price ? 'up' : newPrice < stock.price ? 'down' : stock.trend;
    
    // Add to history and keep only last 20 prices
    const newHistory = [...stock.history, newPrice].slice(-20);
    
    return {
      ...stock,
      price: parseFloat(newPrice.toFixed(2)),
      trend,
      history: newHistory
    };
  });
};

// Get current stock prices
export const getStockPrices = async (difficulty = 'medium') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Update and return fluctuated prices based on difficulty
  const updatedStocks = fluctuatePrices(MOCK_STOCKS, difficulty);
  MOCK_STOCKS.forEach((stock, i) => {
    stock.price = updatedStocks[i].price;
    stock.trend = updatedStocks[i].trend;
    stock.history = updatedStocks[i].history;
  });
  
  return updatedStocks;
};

// Buy stock (mocked for testing)
export const buyStock = async (stockId, userId = 1) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, message: 'Stock purchased!' };
};

// Sell stock (mocked for testing)
export const sellStock = async (stockId, userId = 1) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, message: 'Stock sold!' };
};

// Get user portfolio (mocked for testing)
export const getUserPortfolio = async (userId = 1) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    balance: 100,
    portfolio: {},
    goal: 200
  };
};