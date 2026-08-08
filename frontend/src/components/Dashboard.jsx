import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LogOut, Activity, PlusCircle, Clock, RefreshCcw,
  BarChart2, Menu, X, Zap, TrendingUp
} from 'lucide-react';
import UploadForm from './UploadForm';
import JournalFeed from './JournalFeed';
import API_BASE_URL from '../api/config';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('log');
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => { fetchJournals(); }, []);

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/journals`, { withCredentials: true });
      setJournals(res.data);
    } catch (err) {
      console.error('Failed to fetch journals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => { fetchJournals(); };
  const handleDelete = (id) => { setJournals(prev => prev.filter(j => j.id !== id)); };

  const tabs = [
    { key: 'log',       label: 'Log Trade',  icon: PlusCircle },
    { key: 'past',      label: 'Past Logs',  icon: Clock },
    { key: 'revise',    label: 'Revise',     icon: RefreshCcw },
    { key: 'analytics', label: 'Analytics',  icon: BarChart2 },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setMobileNavOpen(false);
  };

  const activeTabObj = tabs.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen text-text font-sans relative overflow-hidden dashboard-bg">

      {/* Scan line */}
      <div className="scan-line"></div>

      {/* Drifting ambient orbs */}
      <div
        className="fixed top-[-80px] left-[-80px] w-80 h-80 rounded-full pointer-events-none -z-10 opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(126,224,129,0.12) 0%, transparent 70%)',
          animation: 'drift 18s ease-in-out infinite',
        }}
      />
      <div
        className="fixed bottom-[-60px] right-[-60px] w-96 h-96 rounded-full pointer-events-none -z-10 opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(47,201,184,0.10) 0%, transparent 70%)',
          animation: 'drift 22s ease-in-out infinite reverse',
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,183,3,0.05) 0%, transparent 70%)',
          animation: 'drift 30s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" style={{ background: 'rgba(11,17,24,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(37,51,64,0.8)' }}>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 group cursor-default shrink-0">
            <div className="bg-primary/20 p-1.5 sm:p-2 rounded-lg transform-gpu transition-all duration-500 group-hover:rotate-[360deg] shadow-[0_0_15px_rgba(126,224,129,0.35)]">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-black text-sm sm:text-lg tracking-tight text-white hidden sm:block">Trader Journal</span>
          </div>

          {/* Desktop tab nav */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(10,15,20,0.8)', border: '1px solid rgba(37,51,64,0.8)' }}>
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-primary text-background shadow-[0_0_18px_rgba(126,224,129,0.5)]'
                    : 'text-textMuted hover:text-white hover:bg-surface/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile: active tab name */}
          <div className="flex md:hidden items-center gap-2 flex-1 justify-center">
            {activeTabObj && (
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <activeTabObj.icon className="w-4 h-4 text-primary" />
                {activeTabObj.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="md:hidden p-2 rounded-lg border text-textMuted hover:text-primary transition-colors"
              style={{ background: 'rgba(10,15,20,0.8)', borderColor: 'rgba(37,51,64,0.8)' }}
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center text-textMuted hover:text-red-400 transition-all p-2 rounded-lg hover:bg-surface btn-3d"
              title="Disconnect Drive"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-t shadow-2xl" style={{ background: 'rgba(10,15,20,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(37,51,64,0.8)' }}>
            <div className="max-w-5xl mx-auto px-3 py-2 flex flex-col gap-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === key
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(126,224,129,0.2)]'
                      : 'text-textMuted hover:text-white hover:bg-surface/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">

        {/* Log Trade */}
        {activeTab === 'log' && (
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        )}

        {/* Past Logs */}
        {activeTab === 'past' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionHeader
              icon={Clock}
              title="Past Backtest Logs"
              count={journals.length}
              subtitle="Your complete trade history — every setup you've documented."
              color="primary"
            />
            {loading ? <Loader /> : <JournalFeed journals={journals} onDelete={handleDelete} compact={false} />}
          </div>
        )}

        {/* Revise */}
        {activeTab === 'revise' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionHeader
              icon={RefreshCcw}
              title="Revise Trades"
              count={journals.length}
              subtitle="Compact view for deep study sessions. Review your setups and internalize the lessons."
              color="secondary"
            />
            {loading ? <Loader /> : <JournalFeed journals={journals} onDelete={handleDelete} compact={true} />}
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <SectionHeader
              icon={BarChart2}
              title="Analytics"
              subtitle="Your performance metrics and insights."
              color="accent"
            />
            <div className="relative border border-theme-border rounded-2xl bg-surface/50 card-3d overflow-hidden">
              <div className="glare"></div>
              {/* decorative grid bg inside card */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#7ee081 0,#7ee081 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#7ee081 0,#7ee081 1px,transparent 0,transparent 40px)' }}></div>
              <div className="relative z-10 text-center py-16 sm:py-24 px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,183,3,0.2)] animate-float">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Analytics Dashboard</h2>
                <p className="max-w-sm mx-auto text-textMuted text-sm sm:text-base leading-relaxed">
                  Your total PnL, Win Rate, drawdown, and performance charts will appear here once this feature launches.
                </p>
                <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
                  <Zap className="w-3 h-3" />
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────── */

function SectionHeader({ icon: Icon, title, count, subtitle, color }) {
  const colorMap = {
    primary: {
      glow: 'rgba(126,224,129,0.15)',
      border: 'rgba(126,224,129,0.25)',
      bg: 'rgba(126,224,129,0.08)',
      text: 'text-primary',
      dot: '#7ee081',
    },
    secondary: {
      glow: 'rgba(47,201,184,0.15)',
      border: 'rgba(47,201,184,0.25)',
      bg: 'rgba(47,201,184,0.08)',
      text: 'text-secondary',
      dot: '#2fc9b8',
    },
    accent: {
      glow: 'rgba(255,183,3,0.15)',
      border: 'rgba(255,183,3,0.25)',
      bg: 'rgba(255,183,3,0.08)',
      text: 'text-accent',
      dot: '#ffb703',
    },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className="relative rounded-2xl mb-6 sm:mb-8 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${c.bg} 0%, rgba(17,27,36,0.9) 100%)`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 40px ${c.glow}`,
      }}
    >
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)` }}></div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${c.dot} 0, ${c.dot} 1px, transparent 0, transparent 60px)` }}></div>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 20px ${c.glow}` }}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className={`text-lg sm:text-xl font-black text-white`}>{title}</h3>
              {count !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.dot, boxShadow: `0 0 10px ${c.glow}` }}>
                  {count}
                </span>
              )}
            </div>
            {subtitle && <p className="text-textMuted text-xs sm:text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Animated accent line */}
        <div className="hidden sm:flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-full" style={{
              width: 4 + i * 2,
              height: 4 + i * 2,
              background: c.dot,
              opacity: 0.3 + i * 0.2,
            }}></div>
          ))}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${c.dot}, transparent)`, opacity: 0.5 }}></div>
    </div>
  );
}

function Loader() {
  return (
    <div className="text-center py-16 sm:py-20 text-textMuted flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent animate-spin shadow-[0_0_15px_rgba(126,224,129,0.3)]"></div>
      </div>
      <span className="text-sm font-medium">Loading your logs...</span>
    </div>
  );
}
