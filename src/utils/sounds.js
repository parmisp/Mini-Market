// All sounds are generated using Web Audio API
// No external files needed — everything is synthesized in the browser

const AudioContext = window.AudioContext || window.webkitAudioContext;

function getContext() {
  // Browsers require audio context to start from a user gesture
  // So we create it fresh each time it's needed
  const ctx = new AudioContext();
  return ctx;
}

// ──────────────────────────────────────────
// 🪙  COIN — plays when you buy or sell
// ──────────────────────────────────────────
export function playCoinSound() {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

// ──────────────────────────────────────────
// 📈  PRICE UP — plays when a stock trends up
// ──────────────────────────────────────────
export function playPriceUpSound() {
  const ctx = getContext();

  // Two notes going up = "rising" feeling
  const frequencies = [440, 659];

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);

    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.3);
  });
}

// ──────────────────────────────────────────
// 📉  PRICE DOWN — plays when a stock drops
// ──────────────────────────────────────────
export function playPriceDownSound() {
  const ctx = getContext();

  // Two notes going down = "falling" feeling
  const frequencies = [500, 300];

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.35);

    osc.start(ctx.currentTime + i * 0.2);
    osc.stop(ctx.currentTime + i * 0.2 + 0.35);
  });
}

// ──────────────────────────────────────────
// 🏆  MILESTONE — plays when hitting $25, $50, $75, $100
// ──────────────────────────────────────────
export function playMilestoneSound() {
  const ctx = getContext();

  // Three ascending notes = "achievement" feeling
  const frequencies = [523, 659, 784]; // C5, E5, G5 (major chord ascending)

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);

    osc.start(ctx.currentTime + i * 0.2);
    osc.stop(ctx.currentTime + i * 0.2 + 0.5);
  });
}

// ──────────────────────────────────────────
// 🎉  GOAL REACHED — the big one, $200 goal hit
// ──────────────────────────────────────────
export function playGoalReachedSound() {
  const ctx = getContext();

  // Epic fanfare: ascending chord + sustained triumphant note
  const fanfare = [
    { freq: 523, time: 0, duration: 0.3 },    // C5
    { freq: 659, time: 0.15, duration: 0.3 }, // E5
    { freq: 784, time: 0.3, duration: 0.3 },  // G5
    { freq: 1047, time: 0.5, duration: 0.8 }, // C6 — big sustained finish
  ];

  fanfare.forEach(({ freq, time, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + duration);
  });

  // Add a little sparkle on top — high pitched pings
  const sparkles = [1568, 1865, 2093]; // high G, B, C

  sparkles.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.6 + i * 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime + 0.6 + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.6 + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6 + i * 0.1 + 0.2);

    osc.start(ctx.currentTime + 0.6 + i * 0.1);
    osc.stop(ctx.currentTime + 0.6 + i * 0.1 + 0.2);
  });
}

// ──────────────────────────────────────────
// ❌  ERROR — plays when you can't afford or don't own
// ──────────────────────────────────────────
export function playErrorSound() {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

// ──────────────────────────────────────────
// 🎮  MASTER EXPORT — one object for easy importing
// ──────────────────────────────────────────
export const sounds = {
  coin: playCoinSound,
  priceUp: playPriceUpSound,
  priceDown: playPriceDownSound,
  milestone: playMilestoneSound,
  goalReached: playGoalReachedSound,
  error: playErrorSound,
};
