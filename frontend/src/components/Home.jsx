import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, TrendingUp, ShieldCheck, BookOpen, Layers,
  BarChart2, LogIn, ArrowRight, ArrowDown, ImagePlus,
  Target, CheckCircle2, Menu, X,
} from 'lucide-react';
import API_BASE_URL from '../api/config';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  // Close mobile menu on outside click / scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [mobileMenuOpen]);

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const stats = [
    { value: '∞', label: 'Trades Logged', color: 'text-primary' },
    { value: 'R:R', label: 'Auto Calculated', color: 'text-secondary' },
    { value: '100%', label: 'Your Data', color: 'text-accent' },
  ];

  const features = [
    {
      icon: ShieldCheck, color: 'primary',
      title: '100% Private on Google Drive',
      description: 'Your screenshots never touch our servers. We store everything directly in your own Drive folder. Your edge stays yours.',
    },
    {
      icon: ImagePlus, color: 'secondary',
      title: 'Screenshot-First Journaling',
      description: 'Upload chart screenshots directly from your device. Every trade entry is paired with the visual evidence of the setup.',
    },
    {
      icon: BarChart2, color: 'accent',
      title: 'Auto Trade Metrics',
      description: 'Enter Entry, Exit, SL, and Target — instantly get R:R ratio, Points, PnL, and trade duration calculated automatically.',
    },
    {
      icon: BookOpen, color: 'primary',
      title: 'Revise Mode',
      description: 'A compact, distraction-free view for deep review sessions. Study psychology, spot patterns, eliminate mistakes.',
    },
    {
      icon: Target, color: 'secondary',
      title: 'Outcome Tracking',
      description: 'Mark every trade as Target Hit, SL Hit, or Manual Close. Build a rich history of how setups perform in real markets.',
    },
    {
      icon: Layers, color: 'accent',
      title: 'Premium 3D Interface',
      description: 'Hardware-accelerated 3D glassmorphism UI that makes daily journaling feel less like homework and more like an experience.',
    },
  ];

  const steps = [
    {
      num: '01', icon: LogIn,
      title: 'Connect Your Google Drive',
      description: 'One click to authorize. Your Drive becomes your private trade archive. No passwords stored, no data collected.',
    },
    {
      num: '02', icon: ImagePlus,
      title: 'Log Your Trade',
      description: 'Upload your chart screenshot, fill in trade stats, write your rationale, and save in seconds.',
    },
    {
      num: '03', icon: TrendingUp,
      title: 'Analyse & Improve',
      description: "Use Past Logs and Revise tabs to audit trades. See what's working and build a data-driven strategy.",
    },
  ];

  const iconColorMap = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', glow: 'rgba(126,224,129,0.2)', border: 'border-primary/20' },
    secondary: { bg: 'bg-secondary/10', icon: 'text-secondary', glow: 'rgba(47,201,184,0.2)', border: 'border-secondary/20' },
    accent: { bg: 'bg-accent/10', icon: 'text-accent', glow: 'rgba(255,183,3,0.2)', border: 'border-accent/20' },
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden selection:bg-primary/30">
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-72 h-72 sm:w-[600px] sm:h-[600px] bg-secondary/8 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* ── NAVBAR ────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-surface/90 backdrop-blur-xl border-b border-theme-border shadow-xl py-3' : 'bg-transparent py-4 sm:py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-default group">
            <div className="bg-primary/20 p-1.5 sm:p-2 rounded-lg transform-gpu transition-all duration-500 group-hover:rotate-[360deg] shadow-[0_0_15px_rgba(126,224,129,0.3)]">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-black text-base sm:text-xl tracking-tight">Trader Journal</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-textMuted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </div>

          {/* Desktop CTA */}
          <button
            onClick={handleLogin}
            className="hidden md:flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-background font-bold py-2 px-5 rounded-lg border border-primary/30 hover:border-primary transition-all duration-300 btn-3d"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-lg bg-surface/80 border border-theme-border text-textMuted hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-theme-border shadow-2xl">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-textMuted hover:text-white font-semibold py-2 transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-textMuted hover:text-white font-semibold py-2 transition-colors">How It Works</a>
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 bg-primary text-background font-black py-3 px-5 rounded-xl shadow-[0_0_20px_rgba(126,224,129,0.4)] mt-2"
              >
                <GoogleIcon />
                Connect Google Drive
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-16 sm:pt-36 md:pt-48 md:pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text block */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-6 sm:mb-8 shadow-[0_0_20px_rgba(126,224,129,0.2)] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="hidden sm:inline">Trading Journal · </span>Google Drive Powered
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 sm:mb-6 leading-[1.1] tracking-tight">
              Your Trades.{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7ee081, #2fc9b8)' }}>
                Your Growth.
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Your Edge.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-textMuted mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The most visually stunning trade journal for serious traders. Log backtests, review setups, calculate metrics — all privately on your own Google Drive.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto bg-primary text-background font-black py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-3 shadow-[0_15px_35px_-10px_rgba(126,224,129,0.6)] hover:shadow-[0_20px_45px_-10px_rgba(126,224,129,0.8)] hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base btn-3d"
              >
                <GoogleIcon />
                Start for Free with Google
              </button>
              <a href="#how-it-works" className="flex items-center gap-2 text-textMuted hover:text-white font-semibold transition-colors text-sm sm:text-base">
                How it works <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero card visual */}
          <div className="flex-1 w-full max-w-sm sm:max-w-md mx-auto animate-float">
            <div className="relative">
              <div className="bg-surface/70 backdrop-blur-xl border border-theme-border rounded-2xl p-4 sm:p-6 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(126,224,129,0.1)] card-3d overflow-hidden">
                <div className="glare"></div>
                {/* card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">NIFTY 50 Long</div>
                      <div className="text-[10px] sm:text-xs text-textMuted">Aug 7, 2025 · 09:45 AM</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-md text-[10px] sm:text-xs font-bold shadow-[0_0_10px_rgba(126,224,129,0.3)]">
                    Target Hit
                  </span>
                </div>
                {/* fake chart */}
                <div className="w-full h-24 sm:h-32 rounded-xl bg-background border border-theme-border flex items-end px-2 sm:px-3 pb-2 gap-1 mb-4 shadow-inner overflow-hidden">
                  {[40, 55, 45, 60, 52, 70, 65, 80, 72, 90, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{
                      height: `${h}%`,
                      background: i > 7 ? 'rgba(126,224,129,0.75)' : 'rgba(126,224,129,0.2)',
                      boxShadow: i > 7 ? '0 0 8px rgba(126,224,129,0.5)' : 'none',
                    }} />
                  ))}
                </div>
                {/* stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[{ label: 'Entry', val: '24,580', color: 'text-white' }, { label: 'Target', val: '24,720', color: 'text-primary' }, { label: 'R:R', val: '1:2.4', color: 'text-secondary' }].map(({ label, val, color }) => (
                    <div key={label} className="bg-background rounded-lg p-2 text-center border border-theme-border shadow-inner">
                      <div className="text-[9px] sm:text-[10px] text-textMuted uppercase font-bold mb-0.5">{label}</div>
                      <div className={`text-xs sm:text-sm font-black ${color}`}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-secondary text-background px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black shadow-[0_10px_30px_rgba(47,201,184,0.5)] flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm animate-pulse-glow">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                +140 pts
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5 bg-surface border border-theme-border px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 19h15L12 5z" fill="#4285F4" opacity="0.8" />
                  <path d="M4.5 19l4.5-9L2 10z" fill="#34A853" opacity="0.8" />
                  <path d="M19.5 19L12 5 9 10l4.5 9z" fill="#EA4335" opacity="0.8" />
                </svg>
                <span className="text-textMuted">On <span className="text-white">Google Drive</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-textMuted/40 text-xs animate-bounce">
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <div className="border-t border-b border-theme-border bg-surface/40 backdrop-blur-sm py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-3 divide-x divide-theme-border">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="text-center px-3 sm:px-6">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-black mb-1 ${color}`}>{value}</div>
              <div className="text-[10px] sm:text-xs text-textMuted uppercase font-semibold tracking-wider leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <p className="text-secondary text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Engineered for the{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7ee081, #2fc9b8)' }}>
                serious trader.
              </span>
            </h2>
            <p className="text-textMuted text-base sm:text-lg max-w-2xl mx-auto">
              Every feature exists to close the gap between your current performance and your full potential.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, color, title, description }) => {
              const c = iconColorMap[color];
              return (
                <div key={title} className="bg-surface border border-theme-border rounded-2xl p-6 sm:p-7 card-3d overflow-hidden group">
                  <div className="glare"></div>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500`} style={{ boxShadow: `0 0 20px ${c.glow}` }}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-28 bg-surface/30 border-t border-theme-border px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <p className="text-accent text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Up and running in 3 steps.</h2>
            <p className="text-textMuted text-base sm:text-lg max-w-xl mx-auto">No complex setups, no CSV imports. Just connect, log, and grow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {steps.map(({ num, icon: Icon, title, description }, i) => (
              <div
                key={num}
                className={`relative bg-surface border rounded-2xl p-6 sm:p-7 md:p-8 transition-all duration-700 cursor-pointer card-3d overflow-hidden ${activeStep === i ? 'border-primary shadow-[0_0_40px_rgba(126,224,129,0.25)] -translate-y-2' : 'border-theme-border opacity-70 hover:opacity-90'}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="glare"></div>
                <div className="text-5xl sm:text-6xl font-black text-primary/10 absolute top-3 right-5 select-none">{num}</div>
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-all duration-500 ${activeStep === i ? 'bg-primary/20 shadow-[0_0_20px_rgba(126,224,129,0.3)]' : 'bg-background'}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${activeStep === i ? 'text-primary' : 'text-textMuted'}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{description}</p>
                {activeStep === i && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY SECTION ───────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Visual */}
          <div className="flex-shrink-0 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
              <div className="absolute inset-4 sm:inset-6 bg-surface border border-theme-border rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(126,224,129,0.2)] card-3d">
                <div className="glare rounded-full"></div>
                <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary drop-shadow-[0_0_20px_rgba(126,224,129,0.6)]" />
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">Zero-Data Policy</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5 sm:mb-6">
              We see nothing.<br />
              <span className="text-textMuted font-medium text-xl sm:text-2xl">And that's by design.</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                'Your trade screenshots go directly from your device to your Google Drive — we never see them.',
                'Authentication uses Google OAuth 2.0, the same standard used by millions of apps worldwide.',
                'Your trade notes are stored locally only, never sold or shared with any third party.',
                'One-click logout completely revokes our access to your Drive at any time.',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(126,224,129,0.5)]" />
                  <p className="text-textMuted text-sm leading-relaxed text-left">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-b from-surface to-background border border-theme-border rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-14 shadow-[0_0_80px_-20px_rgba(126,224,129,0.25)] card-3d overflow-hidden">
            <div className="glare"></div>
            {/* bg grid */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#7ee081 0,#7ee081 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#7ee081 0,#7ee081 1px,transparent 0,transparent 50%)', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-[0_0_30px_rgba(126,224,129,0.3)] animate-float">
                <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Stop losing your edge.<br className="hidden sm:block" /> Start logging it.
              </h2>
              <p className="text-textMuted text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
                60 seconds to connect and start your first journal entry. Your future self will thank you.
              </p>
              <button
                onClick={handleLogin}
                className="inline-flex bg-primary hover:bg-primary/90 text-background font-black py-3.5 sm:py-4 px-8 sm:px-10 rounded-xl items-center gap-3 shadow-[0_15px_40px_-10px_rgba(126,224,129,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(126,224,129,0.8)] hover:-translate-y-1 transition-all duration-300 btn-3d text-sm sm:text-lg"
              >
                <GoogleIcon />
                Connect Google Drive — Free
              </button>
              <p className="text-textMuted/50 text-xs mt-4">No credit card. No email signup. Just Google.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (SEO) ─────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 bg-surface/20 border-t border-theme-border px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-accent text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">Got Questions?</p>
            <h2 className="text-3xl sm:text-4xl font-black">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[
              { q: 'What is Trader Journal?', a: 'Trader Journal is a free, privacy-first web app that lets you log stock, forex, and crypto trades with chart screenshots, automatically calculate Risk-to-Reward and PnL, and store everything securely in your own Google Drive.' },
              { q: 'Is Trader Journal completely free?', a: 'Yes. Trader Journal is 100% free. Just sign in with your Google account and start journaling your trades instantly — no credit card, no email signup required.' },
              { q: 'How does Trader Journal keep my data private?', a: 'All your chart screenshots are stored directly in your own Google Drive. We never see or store your trade images on our servers. Your proprietary setups stay 100% private and under your control at all times.' },
              { q: 'Can I use Trader Journal for backtesting?', a: 'Absolutely. Trader Journal is designed for both live trade logging and backtest documentation. Upload backtest screenshots, record entry/exit/SL/target levels, and review all setups in the dedicated Revise mode.' },
              { q: 'Does Trader Journal calculate Risk-to-Reward automatically?', a: 'Yes. Enter your Entry Price, Stop Loss, and Target — Trader Journal instantly calculates your Risk-to-Reward ratio, points gained or lost, total PnL, and exact trade duration.' },
              { q: 'Which markets can I journal on Trader Journal?', a: 'Trader Journal works for any financial market — NSE/BSE stocks, Nifty/BankNifty options, Futures, Forex (currency pairs), Crypto (Bitcoin, Ethereum etc.), Commodities, and more.' },
            ].map(({ q, a }, i) => (
              <FaqItem key={i} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-theme-border bg-surface/20 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-md">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-black text-base sm:text-lg">Trader Journal</span>
          </div>
          <p className="text-textMuted text-xs sm:text-sm">
            Built for disciplined traders. © {new Date().getFullYear()} Trader Journal.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs text-textMuted font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── FaqItem accordion ─────────────────────────── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 card-3d ${open ? 'border-primary/40 shadow-[0_0_20px_rgba(126,224,129,0.1)]' : 'border-theme-border'}`}
      itemScope itemType="https://schema.org/Question"
    >
      <div className="glare"></div>
      <button
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left bg-surface/60 hover:bg-surface/90 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="font-bold text-sm sm:text-base text-white" itemProp="name">{question}</span>
        <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'bg-primary text-background border-primary rotate-45' : 'border-theme-border text-textMuted'}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
      </button>
      {open && (
        <div
          className="px-4 sm:px-5 pb-4 sm:pb-5 bg-background/40"
          itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer"
        >
          <p className="text-textMuted text-sm leading-relaxed" itemProp="text">{answer}</p>
        </div>
      )}
    </div>
  );
}
