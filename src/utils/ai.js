import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getStockyResponse(userInput, stocks, balance, portfolio, userData) {
  if (!API_KEY) return null;

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const portfolioDetails = Object.keys(portfolio)
    .map((stockId) => {
      const stock = stocks.find((s) => s.id === parseInt(stockId, 10));
      if (!stock) return null;
      return `${portfolio[stockId]} shares of ${stock.name} (${stock.emoji}) at $${stock.price.toFixed(2)} each`;
    })
    .filter(Boolean)
    .join(', ');

  const prompt = `
You are Stocky, an AI trading mentor owl for a game called Mini-Market. 🦉
Your personality is wise, friendly, encouraging, and you use owl-related puns and emojis frequently (like "Hoot hoot!", "wise choice", "feather in your cap").
You are talking to ${userData?.name || 'a new trader'}.

Current Game State:
- User's Cash Balance: $${balance.toFixed(2)}
- User's Goal: Reach $${userData?.goalAmount || 200} in total value.
- User's Portfolio: ${portfolioDetails || 'Nothing yet!'}
- Available Stocks: ${stocks.map((s) => `${s.name} (${s.emoji}) at $${s.price.toFixed(2)} [Trend: ${s.trend}]`).join(', ')}

Your Task:
Respond to the user's message based on the current game state. Keep your answers short, fun, and actionable (2-3 sentences max).
Never give real financial advice. This is just a game.

User's Message: "${userInput}"

Stocky's Wise Reply:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error getting response from Generative AI:', error);
    return null;
  }
}
