let balance = 100.00;
let targetGoal = 200.00;
let goalName = "AirPod Max";

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

// Goal Settings
function saveSettings() {
    const name = document.getElementById('goal-name-input').value;
    const val = document.getElementById('goal-value-input').value;
    if (name) goalName = name;
    if (val) targetGoal = parseFloat(val);
    document.getElementById('goal-name-display').innerText = goalName;
    document.getElementById('goal-value-display').innerText = `$${targetGoal}`;
    toggleModal('settings');
    updateUI();
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

function addToHistory(type, name, price) {
    const body = document.getElementById('history-body');
    const empty = document.getElementById('no-history');
    if (empty) empty.remove();
    const div = document.createElement('div');
    div.className = `history-item p-4 rounded-[1.5rem] border-l-4 ${type === 'BUY' ? 'border-emerald-500 bg-emerald-500/5' : 'border-red-500 bg-red-500/5'} mb-3 glass-panel`;
    div.innerHTML = `<div class="flex justify-between font-black text-[9px] uppercase mb-1"><span class="${type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}">${type}</span><span class="text-slate-600">${new Date().toLocaleTimeString()}</span></div><div class="flex justify-between items-center"><span class="text-xs font-bold">${name}</span><span class="text-white font-black">$${price.toFixed(2)}</span></div>`;
    body.prepend(div);
}

function buyStock(id) {
    if (balance >= stocks[id].price) {
        balance -= stocks[id].price; stocks[id].owned++;
        addToHistory('BUY', stocks[id].name, stocks[id].price); updateUI();
    } else { stockyAutomatedMsg("Hoot! You need more cash for that trade. 💸"); }
}

function sellStock(id) {
    if (stocks[id].owned > 0) {
        balance += stocks[id].price; stocks[id].owned--;
        addToHistory('SELL', stocks[id].name, stocks[id].price); updateUI();
    }
}

// Stocky AI Logic
function handleChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;
    addChatMessage(input.value, 'user-msg');
    input.value = "";
    setTimeout(() => {
        let reply = "Hoot! That's a great question. Check the rules or ask Stocky about specific stocks.";
        if (msg.includes("buy")) reply = "Stocky's tip: Buy when the price indicator is RED (cheap!) and sell when it's GREEN (profit).";
        if (msg.includes("risk")) reply = "Stocky says: High risk stocks like Nebula swing fast. Be careful out there!";
        if (msg.includes("goal")) reply = `Stocky is helping you save for ${goalName}! You need $${targetGoal} total worth to win.`;
        if (msg.includes("who")) reply = "I'm Stocky, your Vantage AI Mentor! I'm here to help you become a finance pro.";
        addChatMessage(reply, 'veda-msg');
    }, 600);
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

createStockCards(); updateUI();