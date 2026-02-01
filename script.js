let balance = 100.00;
let targetGoal = 200.00;
let goalName = "AirPod Max";
let currentUser = null;
let isSignUpMode = false;

const stocks = {
    eco: { name: "EcoPulse", emoji: "🌿", price: 8.00, owned: 0, risk: "Low", vol: 0.8 },
    apex: { name: "Apex Gaming", emoji: "🎮", price: 12.00, owned: 0, risk: "Mid", vol: 2.2 },
    nebula: { name: "Nebula AI", emoji: "🚀", price: 18.00, owned: 0, risk: "High", vol: 5.5 },
    pet: { name: "PetPals", emoji: "🐶", price: 6.00, owned: 0, risk: "Low", vol: 0.9 },
    snack: { name: "SnackCo", emoji: "🍿", price: 10.00, owned: 0, risk: "Mid", vol: 2.5 },
    music: { name: "VibeTune", emoji: "🎵", price: 15.00, owned: 0, risk: "High", vol: 4.8 }
};

// UI Toggles
function toggleModal(id) { document.getElementById(`${id}-modal`).classList.toggle('hidden'); }
function toggleChat() {
    document.getElementById('chat-window').classList.toggle('hidden');
    document.getElementById('pet-bubble-main').classList.add('hidden');
}

// Auth Functions
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? 'Sign Up' : 'Sign In';
    document.getElementById('auth-submit-btn').innerText = isSignUpMode ? 'Sign Up' : 'Sign In';
    document.getElementById('auth-toggle').innerHTML = isSignUpMode
        ? 'Already have an account? <span class="text-blue-400 font-bold">Sign In</span>'
        : 'Don\'t have an account? <span class="text-blue-400 font-bold">Sign Up</span>';
    document.getElementById('auth-error').classList.add('hidden');
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if (!email || !password) {
        errorEl.innerText = 'Please enter email and password';
        errorEl.classList.remove('hidden');
        return;
    }

    try {
        if (isSignUpMode) {
            await auth.createUserWithEmailAndPassword(email, password);
        } else {
            await auth.signInWithEmailAndPassword(email, password);
        }
    } catch (error) {
        errorEl.innerText = error.message;
        errorEl.classList.remove('hidden');
    }
}

async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Auth State Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        hideAuthModal();
        document.getElementById('signout-btn').classList.remove('hidden');
        await loadGameState();
        createStockCards();
        updateUI();
    } else {
        currentUser = null;
        document.getElementById('signout-btn').classList.add('hidden');
        showAuthModal();
    }
});

// Firestore Functions
async function loadGameState() {
    if (!currentUser) return;

    try {
        // Load profile
        const profileDoc = await db.collection('users').doc(currentUser.uid).get();

        if (profileDoc.exists) {
            const data = profileDoc.data();
            balance = data.balance ?? 100;
            targetGoal = data.targetGoal ?? 200;
            goalName = data.goalName ?? "AirPod Max";

            document.getElementById('goal-name-display').innerText = goalName;
            document.getElementById('goal-value-display').innerText = `$${targetGoal}`;

            // Load stock holdings
            if (data.stocks) {
                Object.keys(data.stocks).forEach(key => {
                    if (stocks[key]) {
                        stocks[key].owned = data.stocks[key].owned || 0;
                    }
                });
            }
        }

        // Load transaction history
        await loadTransactionHistory();
    } catch (error) {
        console.error('Load error:', error);
    }
}

async function saveGameState() {
    if (!currentUser) return;

    try {
        const holdings = {};
        Object.keys(stocks).forEach(key => {
            holdings[key] = { owned: stocks[key].owned };
        });

        await db.collection('users').doc(currentUser.uid).set({
            balance: balance,
            targetGoal: targetGoal,
            goalName: goalName,
            stocks: holdings,
            lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Save error:', error);
    }
}

async function saveTransaction(type, stockId, stockName, price) {
    if (!currentUser) return;

    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('transactions').add({
                type: type,
                stockId: stockId,
                stockName: stockName,
                price: price,
                quantity: 1,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Transaction save error:', error);
    }
}

async function loadTransactionHistory() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('transactions')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        // Clear existing history display
        const body = document.getElementById('history-body');
        body.innerHTML = '';

        if (snapshot.empty) {
            body.innerHTML = '<p id="no-history" class="text-xs text-slate-600 text-center mt-20 italic font-medium">Ready for your first move, investor?</p>';
            return;
        }

        snapshot.docs.reverse().forEach(doc => {
            const t = doc.data();
            addToHistory(t.type, t.stockName, t.price, false);
        });
    } catch (error) {
        console.error('Load history error:', error);
    }
}

// Goal Settings
async function saveSettings() {
    const name = document.getElementById('goal-name-input').value;
    const val = document.getElementById('goal-value-input').value;
    if (name) goalName = name;
    if (val) targetGoal = parseFloat(val);
    document.getElementById('goal-name-display').innerText = goalName;
    document.getElementById('goal-value-display').innerText = `$${targetGoal}`;
    toggleModal('settings');
    updateUI();
    await saveGameState();
}

// Market View
function createStockCards() {
    const container = document.getElementById('stock-container');
    container.innerHTML = "";
    Object.keys(stocks).forEach(key => {
        const s = stocks[key];
        container.innerHTML += `
            <div class="stock-card p-8 flex flex-col">
                <div class="text-6xl mb-4">${s.emoji}</div>
                <h3 class="font-black text-xl">${s.name}</h3>
                <p class="text-[10px] uppercase font-black text-slate-500 mb-6">${s.risk} Risk</p>
                <div class="flex items-center gap-3 mb-8">
                    <span id="price-${key}" class="text-3xl font-black tracking-tighter">$${s.price.toFixed(2)}</span>
                    <span id="change-${key}" class="change-pill up">+$0.00</span>
                </div>
                <div class="flex gap-3 mt-auto">
                    <button onclick="buyStock('${key}')" class="flex-1 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase active:scale-95 transition">Buy</button>
                    <button onclick="sellStock('${key}')" class="flex-1 border border-white/10 py-4 rounded-2xl font-bold text-xs uppercase hover:bg-white/5 active:scale-95 transition">Sell</button>
                </div>
                <div class="mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-500 uppercase">Owned</span>
                    <span id="owned-${key}" class="text-xl font-black text-emerald-400">${s.owned}</span>
                </div>
            </div>`;
    });
}

function updateUI() {
    document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
    let totalWorth = balance;
    Object.keys(stocks).forEach(key => {
        document.getElementById(`owned-${key}`).innerText = stocks[key].owned;
        totalWorth += stocks[key].owned * stocks[key].price;
    });
    let prog = Math.min((totalWorth / targetGoal) * 100, 100);
    document.getElementById('goal-bar').style.width = prog + "%";
    document.getElementById('goal-percent').innerText = Math.floor(prog) + "%";
}

function addToHistory(type, name, price, isNew = true) {
    const body = document.getElementById('history-body');
    const empty = document.getElementById('no-history');
    if (empty) empty.remove();
    const div = document.createElement('div');
    div.className = `history-item p-4 rounded-[1.5rem] border-l-4 ${type === 'BUY' ? 'border-emerald-500 bg-emerald-500/5' : 'border-red-500 bg-red-500/5'} mb-3 glass-panel`;
    const priceDisplay = typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
    div.innerHTML = `<div class="flex justify-between font-black text-[9px] uppercase mb-1"><span class="${type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}">${type}</span><span class="text-slate-600">${new Date().toLocaleTimeString()}</span></div><div class="flex justify-between items-center"><span class="text-xs font-bold">${name}</span><span class="text-white font-black">$${priceDisplay}</span></div>`;
    if (isNew) {
        body.prepend(div);
    } else {
        body.appendChild(div);
    }
}

async function buyStock(id) {
    if (balance >= stocks[id].price) {
        balance -= stocks[id].price;
        stocks[id].owned++;
        addToHistory('BUY', stocks[id].name, stocks[id].price);
        updateUI();
        await saveGameState();
        await saveTransaction('BUY', id, stocks[id].name, stocks[id].price);
    } else {
        stockyAutomatedMsg("Hoot! You need more cash for that trade.");
    }
}

async function sellStock(id) {
    if (stocks[id].owned > 0) {
        balance += stocks[id].price;
        stocks[id].owned--;
        addToHistory('SELL', stocks[id].name, stocks[id].price);
        updateUI();
        await saveGameState();
        await saveTransaction('SELL', id, stocks[id].name, stocks[id].price);
    }
}

// Stocky AI Logic
// --- NEW: AI CONTEXT ENGINE ---

function getMarketCondition() {
    // Determine if market is "Bull" (rising) or "Bear" (falling)
    const prices = Object.values(stocks).map(s => s.price);
    const avgPrice = prices.reduce((a, b) => a + b) / prices.length;
    return avgPrice > 12 ? "bullish" : "bearish";
}

function getUserLevel() {
    // Dynamic experience leveling based on holdings and balance
    const totalOwned = Object.values(stocks).reduce((a, b) => a + b.owned, 0);
    if (totalOwned > 20) return "Pro";
    if (totalOwned > 5) return "Intermediate";
    return "Beginner";
}

function getPortfolioAnalysis() {
    const holdings = Object.entries(stocks).filter(([_, s]) => s.owned > 0);
    if (holdings.length === 0) return "empty";
    
    // Find highest concentration
    const mainStock = holdings.sort((a, b) => b[1].owned - a[1].owned)[0];
    return mainStock[0]; // Returns the ID of their most owned stock
}

// --- API CONFIGURATION ---
const AI_CONFIG = {
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
};

async function handleChat() {
    const input = document.getElementById('chat-input');
    const userMsg = input.value.trim();
    if (!userMsg) return;

    // Display user message
    addChatMessage(userMsg, 'user-msg');
    input.value = "";

    // Prepare Contextual Data for the AI
    const portfolioSummary = Object.entries(stocks)
        .filter(([_, s]) => s.owned > 0)
        .map(([_, s]) => `${s.owned}x ${s.name}`).join(", ") || "No stocks owned";

    const marketSummary = Object.entries(stocks)
        .map(([_, s]) => `${s.name}: $${s.price.toFixed(2)} (${s.risk} Risk)` )
        .join(", ");

    // The "System Instructions" tell the AI how to behave and what the game state is
    const systemPrompt = `
        You are Stocky, a wise owl and financial mentor in a trading game. 
        USER CONTEXT:
        - Current Balance: $${balance.toFixed(2)}
        - Goal: ${goalName} ($${targetGoal})
        - Portfolio: ${portfolioSummary}
        - Market Prices: ${marketSummary}
        - Experience Level: ${getUserLevel()}

        Keep answers concise, witty (use owl puns like 'Hoot'), and helpful. 
        If they ask for advice, use the data above to be specific.
    `;

    try {
        const response = await fetch(`${AI_CONFIG.URL}?key=${AI_CONFIG.API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMsg}` }] }]
            })
        });

        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;
        addChatMessage(aiReply, 'veda-msg');
    } catch (error) {
        console.error("AI Error:", error);
        addChatMessage("Hoot! My brain is a bit foggy. Check your connection!", 'veda-msg');
    }
}

function addChatMessage(text, className) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `p-3 rounded-2xl border ${className}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function stockyAutomatedMsg(text) {
    document.getElementById('pet-bubble-main').classList.remove('hidden');
    document.getElementById('pet-bubble-main').innerText = text;
}

// Market 15s Loop
setInterval(() => {
    Object.keys(stocks).forEach(key => {
        const oldPrice = stocks[key].price;
        stocks[key].price += (Math.random() * stocks[key].vol) - (stocks[key].vol / 2.1);
        if (stocks[key].price < 2) stocks[key].price = 2.50;
        const diff = stocks[key].price - oldPrice;
        const pEl = document.getElementById(`price-${key}`);
        const cEl = document.getElementById(`change-${key}`);
        if(pEl && cEl) {
            pEl.innerText = `$${stocks[key].price.toFixed(2)}`;
            cEl.innerText = `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`;
            cEl.className = `change-pill ${diff >= 0 ? 'up' : 'down'}`;
            pEl.classList.remove('price-flash-up', 'price-flash-down');
            void pEl.offsetWidth; pEl.classList.add(diff >= 0 ? 'price-flash-up' : 'price-flash-down');
        }
    });
    updateUI();
}, 15000);