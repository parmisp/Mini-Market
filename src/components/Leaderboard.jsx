import { useState, useEffect } from 'react';
import { Trophy, X, Clock, Calendar, Crown, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Leaderboard({ isOpen, onClose }) {
  const { getLeaderboard, currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState(null);
  const [experienceFilter, setExperienceFilter] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, timeFilter, ageFilter, experienceFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(timeFilter, ageFilter, experienceFilter);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankStyle = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
    if (index === 1) return 'bg-gradient-to-r from-slate-400/20 to-gray-400/20 border-slate-400/50';
    if (index === 2) return 'bg-gradient-to-r from-amber-700/20 to-orange-700/20 border-amber-700/50';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 uppercase tracking-tight">
                Leaderboard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Time Filter */}
            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
              {[
                { value: 'all', label: 'All Time', icon: Crown },
                { value: 'weekly', label: 'Weekly', icon: Calendar },
                { value: 'daily', label: 'Today', icon: Clock }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTimeFilter(value)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition ${
                    timeFilter === value
                      ? 'bg-yellow-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            {/* Age Filter */}
            <select
              value={ageFilter || ''}
              onChange={(e) => setAgeFilter(e.target.value || null)}
              className="bg-slate-800/50 text-white text-[10px] font-bold uppercase px-3 py-2 rounded-xl border border-slate-700 focus:border-yellow-500 focus:outline-none"
            >
              <option value="">All Ages</option>
              <option value="6-8">6-8 years</option>
              <option value="9-11">9-11 years</option>
              <option value="12-14">12-14 years</option>
              <option value="15+">15+ years</option>
            </select>

            {/* Experience Filter */}
            <select
              value={experienceFilter || ''}
              onChange={(e) => setExperienceFilter(e.target.value || null)}
              className="bg-slate-800/50 text-white text-[10px] font-bold uppercase px-3 py-2 rounded-xl border border-slate-700 focus:border-yellow-500 focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🏆</div>
                <p className="text-slate-400 font-bold">Loading rankings...</p>
              </div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-slate-400 font-bold">No traders found</p>
                <p className="text-slate-600 text-sm mt-2">Be the first to join the leaderboard!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Column Headers */}
              <div className="flex items-center px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span className="w-12">Rank</span>
                <span className="flex-1">Trader</span>
                <span className="w-24 text-right">Net Worth</span>
                <span className="w-20 text-right">Profit</span>
              </div>

              {leaderboardData.map((trader, index) => (
                <div
                  key={trader.userId}
                  className={`flex items-center p-4 rounded-2xl border-2 ${getRankStyle(index)} ${
                    trader.userId === currentUser?.uid ? 'ring-2 ring-emerald-500' : ''
                  } transition hover:scale-[1.02]`}
                >
                  {/* Rank */}
                  <div className="w-12">
                    <span className={`text-xl ${index < 3 ? '' : 'text-slate-500 text-sm font-bold'}`}>
                      {getRankEmoji(index)}
                    </span>
                  </div>

                  {/* Trader Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">
                        {trader.name}
                        {trader.userId === currentUser?.uid && (
                          <span className="ml-2 text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black">
                            YOU
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">
                        {trader.experience || 'beginner'}
                      </span>
                      <span className="text-slate-700">•</span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold">
                        {trader.ageGroup || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Net Worth */}
                  <div className="w-24 text-right">
                    <span className="font-black text-lg text-white">
                      ${trader.netWorth?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Profit % */}
                  <div className="w-20 text-right">
                    <span className={`font-black text-sm flex items-center justify-end gap-1 ${
                      (trader.profitPercent || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      <TrendingUp size={14} className={trader.profitPercent < 0 ? 'rotate-180' : ''} />
                      {(trader.profitPercent || 0) >= 0 ? '+' : ''}
                      {(trader.profitPercent || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <Users size={14} />
            <span>{leaderboardData.length} traders ranked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
