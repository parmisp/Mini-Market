/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'game-primary': '#6366f1', // Indigo 500
                'game-accent': '#f43f5e', // Rose 500 - for "Pop"
                'game-card': '#1e293b',   // Slate 800 - softer dark
                'game-bg': '#0f172a',     // Slate 900
                'coin-gold': '#fbbf24',   // Amber 400
                'trend-up': '#22c55e',    // Green
                'trend-down': '#ef4444',  // Red
            },
            fontFamily: {
                'game': ['"Nunito"', '"Comic Sans MS"', 'sans-serif'],
            },
            boxShadow: {
                'game': '0 4px 0 0 rgba(0, 0, 0, 0.3)', // Button depth
                'game-hover': '0 2px 0 0 rgba(0, 0, 0, 0.3)',
            },
            keyframes: {
                'confetti-fall': {
                    '0%': { 
                        transform: 'translateY(0) rotateZ(0deg)',
                        opacity: '1'
                    },
                    '100%': { 
                        transform: 'translateY(100vh) rotateZ(360deg)',
                        opacity: '0'
                    }
                }
            },
            animation: {
                'confetti-fall': 'confetti-fall 2.5s ease-in forwards',
            }
        },
    },
    plugins: [],
}